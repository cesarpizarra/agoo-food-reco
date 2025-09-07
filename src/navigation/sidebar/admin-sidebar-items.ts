import {
  ChartPie,
  LucideIcon,
  Building2,
  List,
  MessageCircle,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const adminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [{ title: "Overview", url: "/admin", icon: ChartPie }],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Manage Restaurants",
        url: "/admin/restaurants",
        icon: Building2,
      },
      {
        title: "Reviews",
        url: "/admin/reviews",
        icon: MessageCircle,
      },
      {
        title: "Manage Users",
        url: "/admin/users",
        icon: Users,
      },
    ],
  },

  {
    id: 3,
    label: "Manage Categories",
    items: [
      {
        title: "Food Categories",
        url: "/admin/categories",
        icon: List,
      },
      {
        title: "Restaurant Categories",
        url: "/admin/restaurant-categories",
        icon: List,
      },
    ],
  },
];
