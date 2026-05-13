"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/dashboard/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";


import { sidebarMenu } from "@/constants/dashboard-sidebar-menu";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuthContext();
  return (
    <Sidebar collapsible="offcanvas" {...props}>

      <SidebarContent>
        <NavMain items={sidebarMenu.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout()} className="hover:text-red-500">
              <LogOut />
              Log out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}