import { auth } from "@/lib/auth";
import Image from "next/image";

export async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div>
      <Image src={session.user.image!} alt="User Avatar" />
    </div>
  );
}
