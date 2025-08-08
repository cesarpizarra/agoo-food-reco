import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Mail, Calendar, Shield } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./_components/profile-form";

type UserStats = {
  totalReviews: number;
  averageRating: number;
  favoriteRestaurants: number;
};

type RecentActivity = Array<
  | {
      type: "review";
      restaurant: string;
      rating: number;
      date: Date;
    }
  | {
      type: "favorite";
      restaurant: string;
      date: Date;
    }
>;

type UserProfile = {
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    bio: string | null;
    createdAt: Date;
  };
  stats: UserStats;
  recentActivity: RecentActivity;
};

async function getUserData(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const [reviewCount, reviews] = await Promise.all([
    prisma.review.count({ where: { userId } }),
    prisma.review.findMany({
      where: { userId },
      select: { rating: true },
    }),
  ]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const favoriteCount = await prisma.favorite.count({ where: { userId } });

  const recentReviews = await prisma.review.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      rating: true,
      createdAt: true,
      restaurantId: true,
    },
  });

  const recentFavorites = await prisma.favorite.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      restaurantId: true,
    },
  });

  const reviewRestaurantNames = await Promise.all(
    recentReviews.map((review) =>
      prisma.restaurant.findUnique({
        where: { id: review.restaurantId },
        select: { name: true },
      }),
    ),
  );

  const favoriteRestaurantNames = await Promise.all(
    recentFavorites.map((favorite) =>
      prisma.restaurant.findUnique({
        where: { id: favorite.restaurantId },
        select: { name: true },
      }),
    ),
  );

  const recentActivity: RecentActivity = [
    ...recentReviews.map((review, index) => ({
      type: "review" as const,
      restaurant: reviewRestaurantNames[index]?.name || "Unknown Restaurant",
      rating: review.rating,
      date: review.createdAt,
    })),
    ...recentFavorites.map((favorite, index) => ({
      type: "favorite" as const,
      restaurant: favoriteRestaurantNames[index]?.name || "Unknown Restaurant",
      date: favorite.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  return {
    user,
    stats: {
      totalReviews: reviewCount,
      averageRating: Number(averageRating.toFixed(1)),
      favoriteRestaurants: favoriteCount,
    },
    recentActivity,
  };
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        {userData.user.profileImage ? (
                          <AvatarImage
                            src={userData.user.profileImage}
                            alt={userData.user.name || ""}
                          />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {userData.user.name
                              ? userData.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : userData.user.email[0].toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {userData.user.name || userData.user.email}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {userData.user.email}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground flex flex-col gap-2 text-sm">
                  {userData.user.bio && (
                    <div className="text-muted-foreground text-sm">
                      {userData.user.bio}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {userData.user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full md:w-[300px]">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Total Reviews
                    </span>
                    <span className="font-medium">
                      {userData.stats.totalReviews}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Average Rating
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {userData.stats.averageRating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Favorite Restaurants
                    </span>
                    <span className="font-medium">
                      {userData.stats.favoriteRestaurants}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-muted rounded-full p-2">
                            {activity.type === "review" ? (
                              <Star className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.type === "review"
                                ? `Reviewed ${activity.restaurant}`
                                : `Added ${activity.restaurant} to favorites`}
                            </p>
                            {activity.type === "review" && (
                              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {activity.rating} stars
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {activity.date.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <ProfileForm user={userData.user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
