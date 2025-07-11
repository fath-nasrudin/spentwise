import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
