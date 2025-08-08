import TopLoader from "@/components/top-loader";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <TopLoader />
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
