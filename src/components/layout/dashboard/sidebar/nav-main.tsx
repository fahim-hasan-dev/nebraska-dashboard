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
                  className={`rounded-md transition-colors py-[22px] px-4 ${
                    isActive
                      ? "bg-[#f0f7ff] text-[#3b82f6] font-semibold hover:bg-[#e0efff]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium"
                  }`}
                >
                  {item.icon && (
                    <span className="icon">
                      {/* Pass 'fill' based on active state */}
                      {item.icon && <item.icon />}
                    </span>
                  )}

                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
