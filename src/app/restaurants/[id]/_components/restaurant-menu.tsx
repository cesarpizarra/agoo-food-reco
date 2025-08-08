import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { MenuItem } from "@/types/restaurant";

interface RestaurantMenuProps {
  menuItems: MenuItem[];
  restaurantName: string;
}

export function RestaurantMenu({
  menuItems,
  restaurantName,
}: RestaurantMenuProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold">Menu</h2>
        <p className="text-muted-foreground">
          Discover the delicious offerings at {restaurantName}
        </p>
      </div>

      {menuItems.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">
            No menu items available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48">
                <Image
                  src={item.imageUrl || ""}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.category && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category.name}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <span className="text-primary text-lg font-bold">
                    Php {item.price.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
