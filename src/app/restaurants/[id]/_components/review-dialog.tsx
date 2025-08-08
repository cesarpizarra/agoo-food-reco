"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createReview } from "../_actions/create-review-action";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewDialogProps {
  restaurantId: string;
  restaurantName: string;
}

export function ReviewDialog({
  restaurantId,
  restaurantName,
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { data: session } = useSession();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ReviewFormData) => {
    if (!session?.user?.email) {
      toast.error("You must be logged in to add a review");
      return;
    }

    try {
      const result = await createReview({
        ...data,
        restaurantId,
      });

      if (result.success) {
        toast.success("Review added successfully!");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to add review");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the review");
    }
  };

  const handleRatingChange = (newRating: number) => {
    form.setValue("rating", newRating);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600">
          Add Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Review for {restaurantName}</DialogTitle>
          <DialogDescription>
            Share your experience and help others discover great restaurants.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              star <= (hoveredRating || field.value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this restaurant..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || form.watch("rating") === 0}
              >
                {isSubmitting ? "Adding..." : "Add Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
