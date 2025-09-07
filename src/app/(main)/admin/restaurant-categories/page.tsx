import { CategoryTable } from "./_components/category-table";
import { CategoryModal } from "./_components/category-modal";
import { MenuCategory } from "@/types/restaurant";
import { getRestaurantCategories } from "@/data/category/get-restaurant-categories";

export default async function CategoriesPage() {
  const categories = await getRestaurantCategories();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Restaurant Categories</h1>
              <p className="text-muted-foreground text-sm">
                Manage restaurant categories and their details
              </p>
            </div>
            <CategoryModal mode="add" />
          </div>
          <CategoryTable categories={categories.data as MenuCategory[]} />
        </div>
      </div>
    </div>
  );
}
