import { Role } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  profileImage?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
