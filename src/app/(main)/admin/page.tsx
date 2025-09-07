import { Users, Utensils, Star, TrendingUp, List } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { prisma } from "@/lib/prisma";
import { ChartsSection } from "./_components/charts-section";

export default async function Page() {
  const [
    totalUsers,
    totalRestaurants,
    totalCategories,
    totalReviews,
    averageRating,
    totalRestaurantCategories,
    reviewsByMonth,
    restaurantStatusData,
    userRegistrations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.restaurant.count(),
    prisma.menuCategory.count(),
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),
    prisma.restaurantCategory.count(),
    prisma.review.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
    }),
    prisma.restaurant.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    }),
    prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
    }),
  ]);

  const stats = {
    totalUsers,
    totalRestaurants,
    totalCategories,
    totalReviews,
    averageRating: averageRating._avg.rating || 0,
    totalRestaurantCategories,
  };

  const processMonthlyData = (data: Array<{ createdAt: Date; _count: { id: number } }>, label: string) => {
    const monthlyData: { [key: string]: number } = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); 
      monthlyData[monthKey] = 0;
    }
    
    data.forEach(item => {
      const monthKey = item.createdAt.toISOString().slice(0, 7);
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey] += item._count.id;
      }
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      [label]: count,
    }));
  };

  const reviewsChartData = processMonthlyData(reviewsByMonth, 'reviews') as Array<{ month: string; reviews: number }>;
  const usersChartData = processMonthlyData(userRegistrations, 'users') as Array<{ month: string; users: number }>;

  const statusChartData = restaurantStatusData.map(item => ({
    name: item.status,
    value: item._count.id,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">
            Welcome to your admin dashboard! Here&apos;s an overview of your
            platform&apos;s statistics.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <StatsCard
              title="Total Restaurant Categories"
              value={stats.totalRestaurantCategories.toLocaleString()}
              description="Total restaurant categories"
              icon={<List className="h-4 w-4" />}
            />
          </div>

          <ChartsSection 
            reviewsData={reviewsChartData}
            statusData={statusChartData}
            usersData={usersChartData}
          />
        </div>
      </div>
    </div>
  );
}
