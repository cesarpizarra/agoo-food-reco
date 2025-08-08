import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      bio: true,
    },
  });

  if (!user) return null;
  return user;
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userData = await getUserData(session.user.id);

  if (!userData) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <SettingsForm user={userData} />
        </div>
      </div>
    </div>
  );
}
