import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "../_components/restaurant-form";
import { getRestaurantCategories } from "@/data/category/get-restaurant-categories";

export default async function AddRestaurantPage() {
  const categories = await getRestaurantCategories();
  
  if (!categories.success || !categories.data) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load restaurant categories. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantForm mode="add" categories={categories.data} />
        </CardContent>
      </Card>
    </div>
  );
}
