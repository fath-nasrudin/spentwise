import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MainMenu } from "./main-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="border-b px-4 py-2 flex items-center justify-between">
          <SidebarTrigger />
          <MainMenu />
        </div>
        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
