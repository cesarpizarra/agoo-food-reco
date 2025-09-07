import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getRestaurant } from "@/data/restaurant/get-restaurant";
import { getMenuRestaurant } from "@/data/menu/get-restaurant-menu";
import { getRestaurantReviews } from "@/data/review/get-restaurant-reviews";
import { getRestaurantGallery } from "@/data/restaurant/get-restaurant-gallery";
import { RestaurantMenu } from "./_components/restaurant-menu";
import { RestaurantReviews } from "./_components/restaurant-reviews";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RestaurantDetail } from "./_components/restaurant-detail";
import { MenuItem, Restaurant } from "@/types/restaurant";

interface RestaurantPageProps {
  params: Promise<{ id?: string }>;
}

export async function generateMetadata({
  params,
}: RestaurantPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const result = await getRestaurant(resolvedParams.id!);

  if (!result.success || !result.data) {
    return {
      title: "Restaurant Not Found",
    };
  }

  const restaurant = result.data;

  return {
    title: `${restaurant.name} - Restaurant Details`,
    description: restaurant.description,
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const resolvedParams = await params;
  const [restaurantResult, menuItemsResult, reviewsResult, galleryResult] = await Promise.all([
    getRestaurant(resolvedParams.id!),
    getMenuRestaurant(resolvedParams.id!),
    getRestaurantReviews(resolvedParams.id!),
    getRestaurantGallery(resolvedParams.id!),
  ]);

  if (!restaurantResult.success || !restaurantResult.data) {
    notFound();
  }

  if (!menuItemsResult.success || !menuItemsResult.data) {
    throw new Error(menuItemsResult.error || "Failed to load menu items");
  }

  const restaurant = restaurantResult.data;
  const menuItems = menuItemsResult.data;
  const reviews =
    reviewsResult.success && reviewsResult.data ? reviewsResult.data : [];
  const gallery =
    galleryResult.success && galleryResult.data ? galleryResult.data : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-4 pt-32 pb-16">
          <div className="container mx-auto">
            <RestaurantDetail restaurant={restaurant as Restaurant} gallery={gallery} />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <RestaurantMenu
              menuItems={menuItems as MenuItem[]}
              restaurantName={restaurant.name}
            />
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <RestaurantReviews
              reviews={reviews}
              restaurantName={restaurant.name}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
