"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showConfirmAlert } from "@/utils/confirm-alert";
import { toast } from "sonner";
import { deleteCategory } from "../_actions/delete-category-action";
import { CategoryModal } from "./category-modal";
import { getStatusBadgeConfig } from "@/utils/badge-variants";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Category } from "@/types/restaurant";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Category",
      text: "Are you sure you want to delete this category? This action cannot be undone.",
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      try {
        const response = await deleteCategory(id);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        toast.success("Category deleted successfully");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    getStatusBadgeConfig(
                      category.status as "ACTIVE" | "INACTIVE",
                    ).variant
                  }
                  className={`text-white ${getStatusBadgeConfig(category.status as "ACTIVE" | "INACTIVE").className}`}
                >
                  {category.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <CategoryModal category={category} mode="edit">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </CategoryModal>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
