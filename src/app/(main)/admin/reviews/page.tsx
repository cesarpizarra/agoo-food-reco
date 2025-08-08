import { getReviews } from "@/data/review/get-reviews";
import { AdminReviewsTable } from "./_components/admin-reviews-table";

export default async function ReviewsPage() {
  const result = await getReviews();

  if (!result.success) {
    throw new Error(result.error || "Failed to load reviews");
  }

  const reviews = result.data || [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Restaurant Reviews</h1>
              <p className="text-muted-foreground text-sm">
                Manage and moderate restaurant reviews
              </p>
            </div>
          </div>

          <AdminReviewsTable reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
