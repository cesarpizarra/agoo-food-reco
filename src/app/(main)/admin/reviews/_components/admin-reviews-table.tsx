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
import { MoreHorizontal, Star, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { deleteReview } from "../_actions/delete-review-actions";
import { toast } from "sonner";
import { showConfirmAlert } from "@/utils/confirm-alert";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    profileImage: string | null;
  };
  restaurant: {
    name: string;
  };
}

interface AdminReviewsTableProps {
  reviews: Review[];
}

export function AdminReviewsTable({ reviews }: AdminReviewsTableProps) {
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Review",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!confirmed) return;

    setDeletingReviewId(reviewId);
    try {
      const result = await deleteReview(reviewId);
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">No reviews found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(review.user.name, review.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.user.name || review.user.email}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {review.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {review.restaurant.name}
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
      )}
    </div>
  );
}
