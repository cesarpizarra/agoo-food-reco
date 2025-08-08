"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { showConfirmDialog } from "@/utils/alert";
import { TrashIcon } from "lucide-react";
import { deleteMenuItem } from "../_actions/delete-menu-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MenuItemEditDialog } from "./menu-item-edit-dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: { id: string; name: string } | null;
  restaurantId: string;
}

interface MenuTableProps {
  menuItems: MenuItem[];
  categories: { id: string; name: string }[];
}

export function MenuTable({ menuItems, categories }: MenuTableProps) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      "Delete Menu Item",
      "Are you sure you want to delete this menu item? This action cannot be undone.",
      "Delete",
    );

    if (confirmed) {
      try {
        const response = await deleteMenuItem(id);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        toast.success("Menu item deleted successfully");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete menu item");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Items</CardTitle>
      </CardHeader>
      <CardContent>
        {menuItems.length === 0 ? (
          <p className="text-muted-foreground">
            No menu items found for this restaurant.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>Php {item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {item.category?.name || (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <MenuItemEditDialog
                      menuItem={{
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        categoryId: item.category?.id || "",
                        restaurantId: item.restaurantId,
                      }}
                      categories={categories}
                      onSuccess={() => window.location.reload()}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
