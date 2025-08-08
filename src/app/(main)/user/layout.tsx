"use client";

import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { User, Star, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Profile",
    href: "/user/profile",
    icon: User,
  },
  {
    name: "My Reviews",
    href: "/user/reviews",
    icon: Star,
  },
  {
    name: "Settings",
    href: "/user/settings",
    icon: Settings,
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <Card className="p-4">
            <div className="flex justify-center py-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={60}
                height={60}
                priority
              />
            </div>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              <Button
                className="text-red-500"
                variant="ghost"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </Card>
        </aside>

        <div className="md:hidden">
          <nav className="flex space-x-2 overflow-x-auto pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>

        <main className="min-w-0">
          <div className="bg-card rounded-lg border">{children}</div>
        </main>
      </div>
    </div>
  );
}
