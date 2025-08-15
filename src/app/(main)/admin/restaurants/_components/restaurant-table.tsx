"use client";

import { Edit, MoreHorizontal, Trash2, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { getStatusBadgeConfig } from "@/utils/badge-variants";
import { useRouter } from "next/navigation";
import { deleteRestaurant } from "../_actions/delete-resturant-action";
import { toast } from "sonner";
import { Restaurant } from "@/types/restaurant";

type RestaurantWithRelations = Restaurant;

interface RestaurantTableProps {
  restaurants: RestaurantWithRelations[];
}

export function RestaurantTable({ restaurants }: RestaurantTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmAlert({
      title: "Delete Restaurant",
      text: "Are you sure you want to delete this restaurant? This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (confirmed) {
      try {
        const result = await deleteRestaurant(id);
        if (result.success) {
          toast.success("Restaurant deleted successfully");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete restaurant");
        }
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        toast.error("Failed to delete restaurant");
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/restaurants/${id}/edit`);
  };

  const handleManageMenu = (id: string) => {
    router.push(`/admin/restaurants/${id}/menu`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Owner Name</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Opening Hours</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant.id}>
              <TableCell className="font-medium">{restaurant.ownerName}</TableCell>
              <TableCell className="font-medium">{restaurant.name}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeConfig(restaurant.status).variant}
                  className={`text-white ${getStatusBadgeConfig(restaurant.status).className}`}
                >
                  {restaurant.status}
                </Badge>
              </TableCell>
              <TableCell>{restaurant.openingHours}</TableCell>
              <TableCell>{restaurant.averageRating.toFixed(1)}</TableCell>
              <TableCell>{restaurant.totalReviews}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(restaurant.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleManageMenu(restaurant.id)}
                    >
                      <Utensils className="mr-2 h-4 w-4" />
                      Manage Menu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(restaurant.id)}
                      className="text-destructive"
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
