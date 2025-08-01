import { buttonVariants } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <h1 className=" text-3xl sm:text-7xl font-bold">Spentwise</h1>
        <p className="">Know where your money gone</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="#" className={buttonVariants()}>
            Demo
          </Link>
          <Link
            href={session.user.id ? "/dashboard" : "/login"}
            className={buttonVariants({ variant: "secondary" })}
          >
            {session.user.id ? "Dashboard" : "Login"}
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          href="https://github.com/fath-nasrudin/spentwise"
          target="_blank"
          className={buttonVariants({ variant: "ghost" })}
        >
          <SiGithub /> Github
        </a>
      </footer>
    </div>
  );
}
