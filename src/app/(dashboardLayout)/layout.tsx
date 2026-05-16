import { AppSidebar } from "@/components/layout/dashboard/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Image from "next/image";
import logoPng from "@/assets/images/logo.png";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f8f9fa] overflow-hidden">
      {/* Edge-to-Edge Top Header */}
      <header className="flex h-[110px] bg-white border-b border-gray-100 items-center justify-between px-6 z-50 shrink-0 w-full shadow-sm">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src={logoPng}
            alt="logo"
            width={90}
            height={90}
            priority
            className="w-[90px] h-auto object-contain shrink-0"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-[22px] leading-tight truncate text-gray-900">Nebraska Bush Pullers.</span>
            <span className="text-[14px] text-gray-500 mt-0.5 font-medium">Admin Panel</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* <SearchBar /> */}
          {/* <NavUserWrapper /> */}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <SidebarProvider className="flex w-full bg-transparent">
          {/* dashboard sidebar */}
          <AppSidebar className="border-r border-gray-100 !bg-white pt-2 !top-[110px] !h-[calc(100svh-110px)] [&_[data-sidebar=sidebar]]:bg-white" />
          
          <SidebarInset className="bg-transparent flex-1 w-full overflow-y-auto">
            <div className="flex items-center p-4 xl:hidden">
              <SidebarTrigger className="-ml-1" />
            </div>
            {/* dashboard content */}
            <main className="flex-1 p-6 md:p-8 xl:pt-8 w-full">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
