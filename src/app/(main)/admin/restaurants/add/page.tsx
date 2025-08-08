"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RestaurantForm } from "../_components/restaurant-form";

export default function AddRestaurantPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantForm mode="add" />
        </CardContent>
      </Card>
    </div>
  );
}
