import { SignOutButton } from "@/components/SignOutButton";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p>{session.user.name}</p>
        <p>{session.user.id}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
