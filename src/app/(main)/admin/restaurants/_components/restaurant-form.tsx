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
import { RestaurantCategory } from "@prisma/client";

interface RestaurantFormProps {
  restaurant?: Restaurant;
  mode: "add" | "edit";
  categories: RestaurantCategory[];
}

export function RestaurantForm({
  restaurant,
  mode,
  categories,
}: RestaurantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    restaurant?.imageUrl || "",
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<
    Array<{
      id: string;
      imageUrl: string;
      caption?: string | null;
    }>
  >(restaurant?.gallery || []);

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
      categoryId: restaurant?.categoryId || undefined,
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

  const handleGalleryChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews: string[] = [];
    const newCaptions: string[] = [];

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        newCaptions.push("");
        if (newPreviews.length === newFiles.length) {
          setGalleryPreviews([...galleryPreviews, ...newPreviews]);
          setGalleryCaptions([...galleryCaptions, ...newCaptions]);
        }
      };
      reader.readAsDataURL(file);
    });

    setGalleryFiles([...galleryFiles, ...newFiles]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
    setGalleryCaptions(galleryCaptions.filter((_, i) => i !== index));
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    const newCaptions = [...galleryCaptions];
    newCaptions[index] = caption;
    setGalleryCaptions(newCaptions);
  };

  const removeExistingGalleryImage = (imageId: string) => {
    setExistingGalleryImages((prev) =>
      prev.filter((img) => img.id !== imageId),
    );
  };

  const onSubmit = async (data: RestaurantFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedImageFile) {
        data.imageUrl = selectedImageFile as unknown as string;
      } else if (data.imageUrl) {
        data.imageUrl = data.imageUrl;
      }

      // Add gallery data
      data.galleryImages = galleryFiles;
      data.galleryCaptions = galleryCaptions;
      data.existingGalleryImages = existingGalleryImages;

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

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    No categories available. Create a restaurant category first.
                  </p>
                )}
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

          {/* Gallery Images Section */}
          <div className="md:col-span-2">
            <FormLabel>Gallery Images</FormLabel>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleGalleryChange(e.target.files)}
                className="file:bg-primary/10 file:text-primary hover:file:bg-primary/20 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                disabled={isSubmitting}
              />

              {/* Existing Gallery Images */}
              {existingGalleryImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">
                    Current Gallery Images:
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {existingGalleryImages.map((image) => (
                      <div key={image.id} className="group relative">
                        <Image
                          src={image.imageUrl}
                          alt={image.caption || "Gallery image"}
                          width={200}
                          height={200}
                          className="h-32 w-full rounded border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingGalleryImage(image.id)}
                          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                          disabled={isSubmitting}
                          title="Remove image"
                        >
                          ×
                        </button>
                        {image.caption && (
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Gallery Images */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="group relative">
                      <Image
                        src={preview}
                        alt={`Gallery image ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-32 w-full rounded border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                      <input
                        type="text"
                        placeholder="Caption (optional)"
                        value={galleryCaptions[index] || ""}
                        onChange={(e) =>
                          updateGalleryCaption(index, e.target.value)
                        }
                        className="mt-2 w-full rounded border px-2 py-1 text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        </div>
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
