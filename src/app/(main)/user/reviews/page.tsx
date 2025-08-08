import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getUserReviews } from "@/data/review/get-user-reviews";
import { UserReviewsTable } from "./_components/user-reviews-table";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const result = await getUserReviews();

  if (!result.success) {
    throw new Error(result.error || "Failed to load reviews");
  }

  const reviews = result.data || [];

  const stats = {
    totalReviews: reviews.length,
    averageRating:
      reviews.length > 0
        ? (
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "0.0",
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Reviews</h1>
              <p className="text-muted-foreground text-sm">
                View and manage your restaurant reviews
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Reviews
                </CardTitle>
                <Star className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReviews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
              </CardContent>
            </Card>
          </div>

          <UserReviewsTable reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
