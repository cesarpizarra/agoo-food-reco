import { getRestaurants } from "@/data/restaurant/get-restaurants";
import { RestaurantTable } from "./_components/restaurant-table";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/restaurant";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RestaurantsPage() {
  const result = await getRestaurants();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load restaurants");
  }

  const restaurants = result.data as Restaurant[];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Restaurants</h1>
        <Link href="/admin/restaurants/add">
          <Button>
            <Plus />
            Add Restaurant
          </Button>
        </Link>
      </div>

      <RestaurantTable restaurants={restaurants} />
    </div>
  );
}
