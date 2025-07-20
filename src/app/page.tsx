import { Button, buttonVariants } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">
        <h1 className=" text-3xl sm:text-7xl font-bold">Spentwise</h1>
        <p className="">Know where your money gone</p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button>Demo</Button>
          <Link href="/login" className="cursor-pointer">
            <Button variant={"secondary"}>Login</Button>
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
