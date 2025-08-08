"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Trash2, ExternalLink } from "lucide-react";
import { deleteUserReview } from "../_actions/delete-user-review-action";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Review } from "@/types/restaurant";
import { showConfirmAlert } from "@/utils/confirm-alert";

interface UserReviewsTableProps {
  reviews: Review[];
}

export function UserReviewsTable({ reviews }: UserReviewsTableProps) {
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Review",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    setDeletingReviewId(reviewId);
    if (confirmed) {
      try {
        const result = await deleteUserReview(reviewId);
        if (result.success) {
          toast.success("Review deleted successfully");
        } else {
          toast.error(result.error || "Failed to delete review");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while deleting the review");
      } finally {
        setDeletingReviewId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground mb-4 text-lg">
          You haven&apos;t written any reviews yet.
        </p>
        <Button asChild>
          <Link href="/restaurants">Browse Restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Restaurant</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={review.restaurant.imageUrl}
                      alt={review.restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{review.restaurant.name}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-auto p-0 text-xs"
                      asChild
                    >
                      <Link href={`/restaurants/${review.restaurant.id}`}>
                        View Restaurant
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{review.rating}/5</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <p className="truncate">
                  {review.comment || "No comment provided"}
                </p>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(review.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={deletingReviewId === review.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deletingReviewId === review.id
                        ? "Deleting..."
                        : "Delete Review"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
