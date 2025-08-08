"use client";

import { useState, ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { categoryFormSchema, CategoryFormData } from "@/schemas";
import { createCategory } from "../_actions/create-category-action";
import { updateCategory } from "../_actions/update-category-action";
import { useRouter } from "next/navigation";
import { Category } from "@/types/restaurant";

interface CategoryModalProps {
  category?: Category;
  mode: "add" | "edit";
  onSuccess?: () => void;
  children?: ReactNode;
}

export function CategoryModal({
  category,
  mode,
  onSuccess,
  children,
}: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      status: (category?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
        status: (category?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      if (mode === "add") {
        const result = await createCategory(data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Category created successfully");
        form.reset({
          name: "",
          description: "",
          status: "ACTIVE",
        });
      } else {
        if (!category?.id) return;
        const result = await updateCategory(category.id, data);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Category updated successfully");
      }
      setOpen(false);
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button type="button">
      <Plus className="mr-2 h-4 w-4" />
      {mode === "add" ? "Add Category" : "Edit Category"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new food category to the system."
              : "Update the category information."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? `${mode === "add" ? "Creating" : "Updating"}...`
                  : `${mode === "add" ? "Create" : "Update"} Category`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
