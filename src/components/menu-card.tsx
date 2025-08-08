import Image from 'next/image';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {LocationEdit} from 'lucide-react'
import { Button } from '@/components/ui/button';

interface MenuCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export function MenuCard({
  imageUrl,
  title,
  description,
}: MenuCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={imageUrl} alt={title} fill className="object-cover " />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" size="sm" className="gap-2">
          <LocationEdit className="w-4 h-4" />
          View Location
        </Button>
      </CardFooter>
    </Card>
  );
}
