import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPopularRestaurants } from "@/data/restaurant/get-popular-restaurants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await getPopularRestaurants();
  const popularRestaurants = result.success && result.data ? result.data : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="px-4 pt-32 pb-16">
          <div className="container mx-auto space-y-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Discover Your Next
              <span className="text-primary"> Favorite Restaurant</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Explore the best restaurants in Agoo, La Union. From local
              favorites to international cuisine, find your perfect dining
              destination.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-green-600">
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Popular Restaurants
            </h2>
            {popularRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {popularRestaurants.map((restaurant) => (
                  <Card
                    key={restaurant.id}
                    className="overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-48">
                      <Image
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1 text-lg">
                          {restaurant.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">
                          {restaurant.ownerName}
                        </CardDescription>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">
                            {restaurant.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {restaurant.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {restaurant.address}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                          <Clock className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {restaurant.openingHours}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        asChild
                      >
                        <Link href={`/restaurants/${restaurant.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No restaurants available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Discover Restaurants</h3>
                <p className="text-muted-foreground">
                  Find the best restaurants in Agoo, La Union, from local
                  favorites to international cuisine.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Read Reviews</h3>
                <p className="text-muted-foreground">
                  Get insights from real customers and make informed dining
                  decisions.
                </p>
              </div>
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold">Explore Menus</h3>
                <p className="text-muted-foreground">
                  Browse restaurant menus and discover new dishes to try.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
