"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Mail,
  Navigation,
  Camera,
  ChevronRight,
  User,
} from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ReviewDialog } from "./review-dialog";
import { FavoriteButton } from "./favorite-button";
import { Restaurant } from "@/types/restaurant";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  gallery: Array<{
    id: string;
    imageUrl: string;
    caption?: string | null;
    createdAt: Date;
  }>;
}

export function RestaurantDetail({
  restaurant,
  gallery,
}: RestaurantDetailProps) {
  const { data: session } = useSession();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const allImages = [
    {
      id: "main",
      imageUrl: restaurant.imageUrl || "",
      caption: `Main photo of ${restaurant.name}`,
    },
    ...gallery,
  ];

  return (
    <div className="bg-white">
      {/* Header Section - TripAdvisor Style */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Restaurant Title and Rating */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
                {restaurant.name}
              </h1>
              <div className="mb-3 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {restaurant.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({restaurant.totalReviews} reviews)
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-600"
                >
                  {restaurant.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <FavoriteButton restaurantId={restaurant.id} />
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setIsGalleryOpen(true)}
              >
                See all {allImages.length} photos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {/* Main Photo */}
              <div
                className="col-span-2 row-span-2 cursor-pointer"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setIsGalleryOpen(true);
                }}
              >
                <div className="relative h-48 overflow-hidden rounded-md transition-opacity hover:opacity-90 md:h-80">
                  <Image
                    src={restaurant.imageUrl || ""}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Gallery Photos */}
              {gallery.slice(0, 3).map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative h-24 cursor-pointer overflow-hidden rounded-lg md:h-32"
                  onClick={() => {
                    setSelectedImageIndex(index + 1);
                    setIsGalleryOpen(true);
                  }}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption || `Restaurant photo ${index + 1}`}
                    fill
                    className="object-cover transition-opacity hover:opacity-90"
                  />
                </div>
              ))}

              {/* More Photos Overlay */}
              {gallery.length > 3 && (
                <div
                  className="relative flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 transition-colors hover:bg-gray-300 md:h-32"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <div className="text-center text-gray-600">
                    <Camera className="mx-auto mb-1 h-8 w-8" />
                    <span className="text-sm font-medium">
                      +{gallery.length - 3} more
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {session?.user && (
              <ReviewDialog
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            )}
            <Button
              variant="outline"
              onClick={() => setShowMap((prev) => !prev)}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {showMap ? "Hide Map" : "Get Directions"}
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {showMap && (
          <div className="mb-8 overflow-hidden rounded-lg border">
            <iframe
              title="Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${restaurant.name}, ${restaurant.address}`)}&z=14&output=embed`}
              className="h-[400px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Section */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About</h2>
              <p className="leading-relaxed text-gray-700">
                {restaurant.description}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Owner</p>
                    <p className="text-gray-600">{restaurant.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{restaurant.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{restaurant.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Opening Hours</p>
                    <p className="text-gray-600">{restaurant.openingHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Restaurant Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {restaurant.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold">
                      {restaurant.totalReviews}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge
                      variant={
                        restaurant.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {restaurant.status}
                    </Badge>
                  </div>
                  {restaurant.ownerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Owner</span>
                      <span className="font-semibold">
                        {restaurant.ownerName}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Actions
                </h3>
                <div className="space-y-3">
                  <ReviewDialog
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                  <FavoriteButton restaurantId={restaurant.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-h-[90vh] max-w-6xl p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {restaurant.name} - All Photos
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 pt-0">
            {/* Main Image Display */}
            <div className="mb-6">
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={allImages[selectedImageIndex]?.imageUrl || ""}
                  alt={
                    allImages[selectedImageIndex]?.caption ||
                    `Photo ${selectedImageIndex + 1}`
                  }
                  fill
                  className="object-contain"
                />
              </div>
              {allImages[selectedImageIndex]?.caption && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  {allImages[selectedImageIndex].caption}
                </p>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
              {allImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative h-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-colors md:h-20 ${
                    index === selectedImageIndex
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || `Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              {selectedImageIndex + 1} of {allImages.length} photos
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
