"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="gap-4">

      <SidebarMenu className="gap-3 mt-1">
        {items.map((item) => {
          const isActive = item.url === pathname;

          return (
            <Link href={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`rounded-md py-2.5 px-3 text-sm h-10 ${
                    isActive
                      ? "bg-[#f0f7ff] text-[#3b82f6] font-semibold hover:bg-[#e0efff]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                  <span className="transition-all duration-200 ease-linear opacity-100 max-w-[200px] truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:overflow-hidden">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
