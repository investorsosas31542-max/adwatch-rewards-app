import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { RewardsProvider } from "@/hooks/use-rewards";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RewardsProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RewardsProvider>
  );
}
