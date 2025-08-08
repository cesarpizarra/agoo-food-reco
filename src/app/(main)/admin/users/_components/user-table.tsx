"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Mail, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { User } from "@/types/user";
import { EditUserForm } from "./edit-user-form";
import { deleteUser } from "../_actions/delete-user-action";
import { toast } from "sonner";
import { showConfirmAlert } from "@/utils/confirm-alert";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const getRoleBadge = (role: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      ADMIN: { color: "bg-purple-500", label: "Admin" },
      USER: { color: "bg-gray-500", label: "User" },
    };

    const { color, label } = variants[role] || {
      color: "bg-gray-500",
      label: role,
    };

    return (
      <Badge className={`${color} text-white`}>
        <Shield className="mr-1 h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = await showConfirmAlert({
      title: "Delete User",
      text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.name || "No name"}
                    </span>
                    <span className="text-muted-foreground flex items-center text-xs">
                      <Mail className="mr-1 h-3 w-3" />
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <EditUserForm user={user} />
                    </DropdownMenuItem>
                    {user.role === "USER" && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          handleDeleteUser(user.id, user.name || user.email)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    )}
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
