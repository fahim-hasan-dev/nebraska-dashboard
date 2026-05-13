import DashboardBreadcrumb from "@/components/layout/dashboard/navbar/dashboard-breadcrumb";
import NavUserWrapper from "@/components/layout/dashboard/navbar/nav-user-wrapper";
import { AppSidebar } from "@/components/layout/dashboard/sidebar/app-sidebar";
import SearchBar from "@/components/shared/SearchBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="no-scrollbar bg-[#f8f9fa]">
      {/* dashboard sidebar */}
      <AppSidebar />
      <SidebarInset className="bg-transparent flex flex-col min-h-screen">
        {/* dashboard header */}
        <header className="flex h-20 bg-white border-b border-gray-200 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear sticky top-0 z-50 px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="xl:hidden -ml-1" />
            {/* The breadcrumb might not be needed according to the design, but let's keep it just in case or hidden. For now, let's keep it. */}
          </div>
          {/* searchbar */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Keeping these commented out as they don't appear in the design */}
            {/* <SearchBar /> */}
            {/* <NavUserWrapper /> */}
          </div>
        </header>
        {/* dashboard content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
