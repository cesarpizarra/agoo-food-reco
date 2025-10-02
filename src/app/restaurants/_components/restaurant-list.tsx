"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types/restaurant";
import { MapPin, Star, Clock, User, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative h-48">
              <Image
                src={restaurant.imageUrl || ""}
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
                  <User className="h-3 w-3" />
                  <span className="line-clamp-1">
                    Owner: {restaurant.ownerName}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span className="line-clamp-1">
                    {restaurant.openingHours}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                  <Phone className="h-3 w-3" />
                  <span className="line-clamp-1">{restaurant.phone}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                asChild
              >
                <Link href={`/restaurants/${restaurant.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            No restaurants found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
