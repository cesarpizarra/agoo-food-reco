"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const session = useSession();
  const router = useRouter();
  const redirectPath =
    session.data?.user?.role === "ADMIN" ? "/admin" : "/user/profile";
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-200",
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/restaurants"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Restaurants
          </Link>
          <Link
            href="/about"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Contact
          </Link>

          {session.data?.user ? (
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => router.push(redirectPath)}
            >
              <User size={20} />
              <span className="text-sm">{session.data?.user?.email}</span>
            </Button>
          ) : (
            <Button asChild size="sm" className="bg-green-600">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
