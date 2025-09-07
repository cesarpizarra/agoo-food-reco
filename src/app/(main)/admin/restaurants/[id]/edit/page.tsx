import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "../../_components/restaurant-form";
import { notFound } from "next/navigation";
import { Restaurant } from "@/types/restaurant";
import { getRestaurant } from "@/data/restaurant/get-restaurant";
import { getRestaurantCategories } from "@/data/category/get-restaurant-categories";
import { RestaurantCategory } from "@prisma/client";

interface EditRestaurantPageProps {
  params: Promise<{ id?: string }>;
}

export default async function EditRestaurantPage({
  params,
}: EditRestaurantPageProps) {
  const { id } = await params;
  const result = await getRestaurant(id as string);
  const categories = await getRestaurantCategories();

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantForm restaurant={result.data as Restaurant} mode="edit" categories={categories.data as RestaurantCategory[]} />
        </CardContent>
      </Card>
    </div>
  );
}
