import { CategoryTable } from "./_components/category-table";
import { CategoryModal } from "./_components/category-modal";
import { getCategories } from "@/data/category/get-categories";
import { Category } from "@/types/restaurant";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Food Categories</h1>
              <p className="text-muted-foreground text-sm">
                Manage food categories and their details
              </p>
            </div>
            <CategoryModal mode="add" />
          </div>
          <CategoryTable categories={categories.data as Category[]} />
        </div>
      </div>
    </div>
  );
}
