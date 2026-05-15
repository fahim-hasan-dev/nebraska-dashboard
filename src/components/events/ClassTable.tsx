"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";


interface ClassItem {
  id: string | number;
  name: string;
  status: "Pending" | "Live" | "Completed";
}

interface ClassTableProps {
  classes: ClassItem[];
  eventId: string | number;
}

export function ClassTable({ classes, eventId }: ClassTableProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="px-8 py-5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
              Class
            </th>
            <th className="px-8 py-5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-8 py-5 text-[12px] font-semibold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((item) => (
            <tr key={item.id} className="border-b border-gray-50 last:border-0">
              <td className="px-8 py-6">
                <span className="text-[15px] font-bold text-gray-900">{item.name}</span>
              </td>
              <td className="px-8 py-6">
                <span
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[13px] font-medium",
                    item.status === "Pending" && "bg-[#FEF9C3] text-[#A16207]",
                    item.status === "Live" && "bg-[#EFF6FF] text-[#1D4ED8]",
                    item.status === "Completed" && "bg-[#F0FDF4] text-[#15803D]"
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 outline-none p-1 rounded-md hover:bg-gray-50 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1">
                    <DropdownMenuItem className="text-gray-600 cursor-pointer py-2.5 rounded-md focus:bg-gray-50">
                      Mark As Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-600 cursor-pointer py-2.5 rounded-md focus:bg-gray-50">
                      Mark As Live
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
