import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

type StatusType = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | string;

interface StatusConfig {
  variant: VariantProps<typeof badgeVariants>["variant"];
  className?: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  ACTIVE: {
    variant: "default",
    className: "bg-green-500 hover:bg-green-600",
  },
  INACTIVE: {
    variant: "destructive",
    className: "bg-red-500 hover:bg-red-600",
  },
  PENDING: {
    variant: "secondary",
    className: "bg-yellow-500 hover:bg-yellow-600",
  },
  SUSPENDED: {
    variant: "destructive",
    className: "bg-orange-500 hover:bg-orange-600",
  },
};

export const getStatusBadgeConfig = (status: StatusType): StatusConfig => {
  return (
    statusConfig[status] || {
      variant: "secondary",
      className: "bg-gray-500 hover:bg-gray-600",
    }
  );
};

// Helper function to get just the variant
export const getStatusBadgeVariant = (
  status: StatusType,
): VariantProps<typeof badgeVariants>["variant"] => {
  return getStatusBadgeConfig(status).variant;
};

// Helper function to get just the className
export const getStatusBadgeClassName = (status: StatusType): string => {
  return getStatusBadgeConfig(status).className || "";
};
