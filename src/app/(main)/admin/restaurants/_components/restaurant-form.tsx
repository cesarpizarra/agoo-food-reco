"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { restaurantFormSchema, RestaurantFormData } from "@/schemas";
import { createRestaurant } from "../_actions/create-restaurant-action";
import { updateRestaurant } from "../_actions/update-restaurant-action";
import { showConfirmDialog } from "@/utils/alert";
import { Restaurant } from "@/types/restaurant";
import Image from "next/image";

interface RestaurantFormProps {
  restaurant?: Restaurant;
  mode: "add" | "edit";
}

export function RestaurantForm({ restaurant, mode }: RestaurantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    restaurant?.imageUrl || "",
  );

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues: {
      ownerName: restaurant?.ownerName || undefined,
      name: restaurant?.name || "",
      email: restaurant?.email || "",
      phone: restaurant?.phone || "",
      address: restaurant?.address || "",
      imageUrl: restaurant?.imageUrl || "",
      description: restaurant?.description || "",
      openingHours: restaurant?.openingHours || "Monday to Friday: 8 AM - 4 PM",
      status: restaurant?.status || "ACTIVE",
    },
  });

  const handleImageChange = (file: File | null) => {
    setSelectedImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(restaurant?.imageUrl || "");
    }
  };

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedImageFile) {
        data.imageUrl = selectedImageFile as unknown as string;
      } else if (data.imageUrl) {
        data.imageUrl = data.imageUrl;
      }

      let result;
      if (mode === "add") {
        result = await createRestaurant(data);
      } else if (restaurant) {
        result = await updateRestaurant(restaurant.id, data);
      }

      if (!result?.success) {
        if (Array.isArray(result?.error)) {
          result.error.forEach((err) => toast.error(err.message));
        } else if (typeof result?.error === "string") {
          toast.error(result.error);
        } else {
          toast.error(`Failed to ${mode} restaurant`);
        }
        return;
      }

      toast.success(
        `Restaurant ${mode === "add" ? "created" : "updated"} successfully`,
      );
      router.push("/admin/restaurants");
      router.refresh();
    } catch (error) {
      console.error(`Error ${mode}ing restaurant:`, error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
        <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter restaurant name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter restaurant name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    disabled={mode === "edit"}
                    className={`${mode === "edit" ? "bg-gray-200" : ""}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="max-w-xs">
            <FormLabel>Restaurant Image</FormLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleImageChange(file);
              }}
              className="file:bg-primary/10 file:text-primary hover:file:bg-primary/20 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
              disabled={isSubmitting}
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className="mt-2 h-32 w-32 rounded border object-cover"
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter restaurant description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="openingHours"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Opening Hours</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Monday to Friday: 8 AM - 4 PM, Saturday: 9 AM - 2 PM"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "edit" && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              const isConfirmed = await showConfirmDialog(
                "Cancel Restaurant",
                "Are you sure you want to cancel? Any unsaved changes will be lost.",
                "Yes, cancel",
                "No, continue editing",
              );

              if (!isConfirmed) return;
              router.back();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? `${mode === "add" ? "Creating" : "Updating"}...`
              : `${mode === "add" ? "Create" : "Update"} Restaurant`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
