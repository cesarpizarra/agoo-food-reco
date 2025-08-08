import { getRestaurant } from "@/data/restaurant/get-restaurant";
import { MenuItemForm } from "../_components/menu-item-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getCategories } from "@/data/category/get-categories";

interface AddRestaurantMenuItemPageProps {
  params: Promise<{ id?: string }>;
}

export default async function AddRestaurantMenuItemPage({
  params,
}: AddRestaurantMenuItemPageProps) {
  const resolvedParams = await params;
  const [restaurantResult, categoriesResult] = await Promise.all([
    getRestaurant(resolvedParams.id!),
    getCategories(),
  ]);

  if (!restaurantResult.success || !restaurantResult.data) {
    notFound();
  }

  const restaurant = restaurantResult.data;
  const categories = categoriesResult.data;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href={`/admin/restaurants/${resolvedParams.id}/menu`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurant Menu
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add Menu Item</h1>
        <p className="text-muted-foreground">
          Add a new menu item to {restaurant.name}
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Menu Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuItemForm
              restaurantId={restaurant.id}
              categories={categories || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
