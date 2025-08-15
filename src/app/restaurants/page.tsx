import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RestaurantList } from "@/app/restaurants/_components/restaurant-list";
import { getRestaurants } from "@/data/restaurant/get-restaurants";
import { Metadata } from "next";
import { Restaurant } from "@/types/restaurant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurants in Agoo, La Union",
  description: "Discover the best places to eat in Agoo, La Union.",
};

export default async function RestaurantsPage() {
  const result = await getRestaurants();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Failed to load restaurants");
  }

  const restaurants = result.data as Restaurant[];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-4 pt-32 pb-16">
          <div className="container mx-auto space-y-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              Restaurants in Agoo
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Discover the best places to eat in Agoo, La Union. From local
              favorites to international cuisine, find your next dining
              destination.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <RestaurantList restaurants={restaurants} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
