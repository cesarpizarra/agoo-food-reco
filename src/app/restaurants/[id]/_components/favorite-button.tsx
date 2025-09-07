"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleFavorite } from "../_actions/toggle-favorite-action";
import { checkFavoriteStatus } from "../_actions/check-favorite-status-action";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  restaurantId: string;
}

export function FavoriteButton({ restaurantId }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkStatus = async () => {
      if (session?.user) {
        const result = await checkFavoriteStatus(restaurantId);
        if (result.success && result.data) {
          setIsFavorited(result.data.isFavorited);
        }
      }
    };

    checkStatus();
  }, [restaurantId, session?.user]);

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      toast.error("You must be logged in to add favorites");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavorite(restaurantId);
      if (result.success && result.data) {
        setIsFavorited(result.data.isFavorited);
        toast.success(
          result.data.isFavorited
            ? "Added to favorites!"
            : "Removed from favorites!",
        );
      } else {
        toast.error(result.error || "Failed to toggle favorite");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full justify-start"
      variant="outline"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current text-red-500" : ""}`} />
      {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );
}
