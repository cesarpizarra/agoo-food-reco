"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "../_components/signup-form";

export default function SignUpPage() {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <div className="text-muted-foreground mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
