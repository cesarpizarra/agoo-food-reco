import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { MenuTable } from "./_components/menu-table";
import { getCategories } from "@/data/category/get-categories";
import { getRestaurant } from "@/data/restaurant/get-restaurant";
import { getRestaurants } from "@/data/restaurant/get-restaurants";
import { getMenuRestaurant } from "@/data/menu/get-restaurant-menu";

interface RestaurantMenuPageProps {
  params: Promise<{ id?: string }>;
}

export default async function RestaurantMenuPage({
  params,
}: RestaurantMenuPageProps) {
  const resolvedParams = await params;
  const [
    menuItemsResult,
    restaurantResult,
    restaurantsResult,
    categoriesResult,
  ] = await Promise.all([
    getMenuRestaurant(resolvedParams.id!),
    getRestaurant(resolvedParams.id!),
    getRestaurants(),
    getCategories(),
  ]);

  if (!restaurantResult.success || !restaurantResult.data) {
    notFound();
  }

  if (!menuItemsResult.success || !menuItemsResult.data) {
    throw new Error(menuItemsResult.error || "Failed to load menu items");
  }

  if (!restaurantsResult.success || !restaurantsResult.data) {
    throw new Error(restaurantsResult.error || "Failed to load restaurants");
  }

  if (!categoriesResult.success || !categoriesResult.data) {
    throw new Error(categoriesResult.error || "Failed to load categories");
  }

  const menuItems = menuItemsResult.data;
  const restaurant = restaurantResult.data;
  const categories = categoriesResult.data;
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link href={`/admin/restaurants`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurant
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">
              Manage menu items for {restaurant.name}
            </p>
          </div>
          <Link href={`/admin/restaurants/${resolvedParams.id}/menu/add`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Restaurant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Restaurant Name
              </label>
              <p className="text-lg font-semibold">{restaurant.name}</p>
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Status
              </label>
              <Badge
                variant={restaurant.status === "ACTIVE" ? "success" : "error"}
              >
                {restaurant.status}
              </Badge>
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Total Menu Items
              </label>
              <p className="text-lg font-semibold">{menuItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MenuTable menuItems={menuItems} categories={categories} />
    </div>
  );
}
