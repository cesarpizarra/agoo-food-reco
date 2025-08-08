import { UserTable } from "./_components/user-table";
import { getUsers } from "@/data/user/get-users";
import { AddUserForm } from "./_components/add-user-form";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <p className="text-muted-foreground text-sm">
                View and manage user accounts and permissions
              </p>
            </div>
            <AddUserForm />
          </div>

          <UserTable users={users} />
        </div>
      </div>
    </div>
  );
}
