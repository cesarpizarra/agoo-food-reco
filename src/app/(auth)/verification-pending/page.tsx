"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg">
              We&apos;ve sent a verification link to your email address. Please
              check your inbox and click the verification link to activate your
              account.
            </p>
            <p className="text-muted-foreground text-sm">
              This helps us prevent spam and ensure your account security.
              <br />
              If you don&apos;t see the email, check your spam folder or contact
              support.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Create Another Account</Link>
            </Button>
          </div>

          <div className="text-muted-foreground text-xs">
            <p>
              Having trouble? Contact support at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
