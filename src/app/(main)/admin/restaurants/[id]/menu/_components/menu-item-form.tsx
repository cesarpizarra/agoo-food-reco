"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createMenuItem } from "@/app/(main)/admin/restaurants/[id]/menu/_actions/create-menu-action";
import { MenuItemFormData, menuItemFormSchema } from "@/schemas";
import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showConfirmDialog } from "@/utils/alert";
import Image from "next/image";

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuItemFormProps {
  restaurantId: string;
  categories: MenuCategory[];
}

export function MenuItemForm({ restaurantId, categories }: MenuItemFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(
      menuItemFormSchema,
    ) as UseFormProps<MenuItemFormData>["resolver"],
    defaultValues: {
      restaurantId,
      name: "",
      description: "",
      price: 0,
      categoryId: undefined as unknown as string,
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const onSubmit = async (data: MenuItemFormData) => {
    setIsSubmitting(true);

    if (imageFile) {
      data.imageUrl = imageFile as unknown as string;
    }
    try {
      const result = await createMenuItem(data);
      if (result?.success) {
        toast.success("Menu item created successfully");
        router.back();
      } else {
        toast.error(result?.error || "Failed to create menu item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter menu item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter menu item description"
                  rows={3}
                  {...field}
                />
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
              <FormLabel>Category *</FormLabel>
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
                  No menu categories available. Create a menu category first.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label htmlFor="image">Image *</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
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
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Menu Item"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              const isConfirmed = await showConfirmDialog(
                "Cancel Menu Item",
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
        </div>
      </form>
    </Form>
  );
}
