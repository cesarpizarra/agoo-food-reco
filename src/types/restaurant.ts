export type Restaurant = {
  id: string;
  ownerName?: string;
  name: string;
  description: string;
  imageUrl?: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  averageRating: number;
  totalReviews: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: { name: string } | null;
  restaurantId: string;
  categoryId: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
