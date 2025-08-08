import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Coffee, Store, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Agoo, La Union",
  description: "Discover the best places to eat in Agoo, La Union.",
};

const features = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Local Food Spots",
    description: "Discover hidden gems and popular eateries in Agoo, La Union.",
  },
  {
    icon: <Store className="h-6 w-6" />,
    title: "Restaurant Guide",
    description: "Find the best restaurants, cafes, and food stalls in town.",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Local Favorites",
    description: "Explore must-try dishes and local specialties of Agoo.",
  },
  {
    icon: <Coffee className="h-6 w-6" />,
    title: "Cafe Culture",
    description: "Discover cozy cafes and coffee shops in the area.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 px-4 pt-32 pb-16">
          <div className="container mx-auto space-y-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
              Discover Agoo&apos;s Food Scene
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Your ultimate guide to the best local restaurants, cafes, and food
              spots in Agoo, La Union. From traditional Filipino cuisine to
              modern cafes, we help you find the perfect place to eat.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  About Agoo&apos;s Food Guide
                </h2>
                <p className="text-muted-foreground text-lg">
                  Welcome to your local food guide for Agoo, La Union!
                  We&apos;re dedicated to showcasing the best dining experiences
                  our town has to offer. From family-owned restaurants serving
                  authentic Ilocano dishes to trendy cafes perfect for your
                  afternoon coffee, we&apos;ve got you covered.
                </p>
                <p className="text-muted-foreground text-lg">
                  Whether you&apos;re a local looking for new places to try or a
                  visitor exploring Agoo&apos;s culinary scene, we help you
                  discover the perfect spot for every craving and occasion.
                </p>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <Image
                  src="/images/adobo.jpg"
                  alt="Agoo Food Scene"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-8 text-center">
              <h2 className="text-3xl font-bold">Agoo&apos;s Food Culture</h2>
              <p className="text-muted-foreground text-lg">
                Agoo, La Union is home to a vibrant food scene that combines
                traditional Ilocano cuisine with modern dining experiences. From
                the famous bagnet and empanada to fresh seafood and local
                delicacies, our town offers a diverse range of flavors that
                reflect our rich cultural heritage.
              </p>
              <p className="text-muted-foreground text-lg">
                Whether you&apos;re craving authentic local dishes or looking
                for a cozy cafe to relax in, Agoo&apos;s food scene has
                something for everyone. Join us in exploring the best of what
                our town has to offer!
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="container mx-auto space-y-8 px-4 text-center">
            <h2 className="text-3xl font-bold">
              Start Exploring Agoo&apos;s Food Scene
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Discover the best places to eat in Agoo, La Union. From local
              favorites to hidden gems, find your next favorite dining spot.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-green-600">
                <Link href="/restaurants">View Restaurants</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
