"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/dashboard/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { sidebarMenu } from "@/constants/dashboard-sidebar-menu";
import { LogOut } from "lucide-react";
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton className="hover:text-red-500 hover:bg-red-50/50">
                  <LogOut className="w-4 h-4" />
                  Log out
                </SidebarMenuButton>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white rounded-2xl border-0 shadow-xl max-w-[400px] p-6">
                <AlertDialogHeader className="space-y-3">
                  <AlertDialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-gray-500 font-medium leading-relaxed">
                    Are you sure you want to log out of the Nebraska Bush Pullers Admin Panel?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex gap-3">
                  <AlertDialogCancel className="rounded-lg font-semibold hover:bg-gray-100 border-gray-200 cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => logout()}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow-sm cursor-pointer"
                  >
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}