import { Users, Utensils, Star, TrendingUp, List } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const [
    totalUsers,
    totalRestaurants,
    totalCategories,
    totalReviews,
    averageRating,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.restaurant.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),
  ]);

  const stats = {
    totalUsers,
    totalRestaurants,
    totalCategories,
    totalReviews,
    averageRating: averageRating._avg.rating || 0,
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">
            Welcome to your admin dashboard! Here&apos;s an overview of your
            platform&apos;s statistics.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              description="Active registered users"
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Restaurants"
              value={stats.totalRestaurants.toLocaleString()}
              description="Registered food establishments"
              icon={<Utensils className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Categories"
              value={stats.totalCategories.toLocaleString()}
              description="Registered food categories"
              icon={<List className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Reviews"
              value={stats.totalReviews.toLocaleString()}
              description="User-submitted reviews"
              icon={<Star className="h-4 w-4" />}
            />
            <StatsCard
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              description="Overall platform rating"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
