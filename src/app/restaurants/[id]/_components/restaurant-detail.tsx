"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ReviewDialog } from "./review-dialog";
import { FavoriteButton } from "./favorite-button";
import { Restaurant } from "@/types/restaurant";

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export function RestaurantDetail({ restaurant }: RestaurantDetailProps) {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="relative h-64 overflow-hidden rounded-lg md:h-80">
        <Image
          src={restaurant.imageUrl || ""}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            {restaurant.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {restaurant.ownerName}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {restaurant.averageRating.toFixed(1)}
              </span>
              <span className="text-sm">
                ({restaurant.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {session?.user && (
          <>
            <ReviewDialog
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
            <FavoriteButton restaurantId={restaurant.id} />
          </>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold">About</h2>

            <p className="text-muted-foreground leading-relaxed">
              {restaurant.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold">Contact & Hours</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="text-primary mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-medium">Opening Hours</p>
                  <p className="text-muted-foreground text-sm">
                    {restaurant.openingHours}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
