"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Restaurant } from "@/types/restaurant";
import { MapPin, Star, Clock, Phone } from "lucide-react";
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
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={restaurant.imageUrl || ""}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>{restaurant.ownerName}</CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {restaurant.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="text-primary h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="text-primary h-4 w-4" />
                  <span>{restaurant.openingHours}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="text-primary h-4 w-4" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/restaurants/${restaurant.id}`}>View Details</Link>
              </Button>
            </CardFooter>
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
