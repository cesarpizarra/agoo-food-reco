"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Star, Clock, Phone, Mail, Navigation, Camera, ChevronRight, X, User } from "lucide-react";
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

export function RestaurantDetail({ restaurant, gallery }: RestaurantDetailProps) {
  const { data: session } = useSession();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Combine main image with gallery images
  const allImages = [
    { id: 'main', imageUrl: restaurant.imageUrl || "", caption: `Main photo of ${restaurant.name}` },
    ...gallery
  ];

  return (
    <div className="bg-white">
      {/* Header Section - TripAdvisor Style */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Restaurant Title and Rating */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{restaurant.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">({restaurant.totalReviews} reviews)</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setIsGalleryOpen(true)}
              >
                See all {allImages.length} photos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Main Photo */}
              <div 
                className="col-span-2 row-span-2 cursor-pointer"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setIsGalleryOpen(true);
                }}
              >
                <div className="relative h-48 md:h-80 rounded-md overflow-hidden hover:opacity-90 transition-opacity">
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
                  className="relative h-24 md:h-32 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(index + 1);
                    setIsGalleryOpen(true);
                  }}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption || `Restaurant photo ${index + 1}`}
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
              
              {/* More Photos Overlay */}
              {gallery.length > 3 && (
                <div 
                  className="relative h-24 md:h-32 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <div className="text-center text-gray-600">
                    <Camera className="h-8 w-8 mx-auto mb-1" />
                    <span className="text-sm font-medium">+{gallery.length - 3} more</span>
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
              onClick={() => {
                const destination = `${restaurant.name}, ${restaurant.address}`;
                const encodedDestination = encodeURIComponent(destination);
                const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
                window.open(googleMapsUrl, '_blank');
              }}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {restaurant.description}
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Information</h2>
              <div className="space-y-4">
              <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Owner</p>
                    <p className="text-gray-600">{restaurant.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{restaurant.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{restaurant.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
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
                <h3 className="text-lg font-bold mb-4 text-gray-900">Restaurant Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{restaurant.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-semibold">{restaurant.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={restaurant.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {restaurant.status}
                    </Badge>
                  </div>
                  {restaurant.ownerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Owner</span>
                      <span className="font-semibold">{restaurant.ownerName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Actions</h3>
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
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {restaurant.name} - All Photos
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGalleryOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            {/* Main Image Display */}
            <div className="mb-6">
              <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={allImages[selectedImageIndex]?.imageUrl || ""}
                  alt={allImages[selectedImageIndex]?.caption || `Photo ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              {allImages[selectedImageIndex]?.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {allImages[selectedImageIndex].caption}
                </p>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {allImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative h-16 md:h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                    index === selectedImageIndex 
                      ? 'border-blue-500' 
                      : 'border-transparent hover:border-gray-300'
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
