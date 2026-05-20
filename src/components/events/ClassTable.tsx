"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface ClassItem {
  name: string;
  status: "pending" | "live" | "completed";
}

interface ClassTableProps {
  classes: ClassItem[];
  eventId: string;
  onRefresh?: () => void;
}

export function ClassTable({ classes, eventId, onRefresh }: ClassTableProps) {
  const handleStatusChange = async (className: string, newStatus: "pending" | "live" | "completed") => {
    toast.loading(`Updating ${className} status to ${newStatus}...`, { id: "update-status" });
    try {
      const response = await myFetch(`/event/${eventId}/class/${encodeURIComponent(className)}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });

      if (response.success) {
        toast.success(`Class status updated successfully!`, { id: "update-status" });
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || "Failed to update class status", { id: "update-status" });
      }
    } catch (error) {
      console.error("Error updating class status:", error);
      toast.error("An unexpected error occurred.", { id: "update-status" });
    }
  };

  const handleDeleteClass = async (className: string) => {
    if (!confirm(`Are you sure you want to delete the class "${className}"?`)) {
      return;
    }

    toast.loading(`Deleting ${className}...`, { id: "delete-class" });
    try {
      const response = await myFetch(`/event/${eventId}/class/${encodeURIComponent(className)}`, {
        method: "DELETE",
      });

      if (response.success) {
        toast.success(`Class deleted successfully!`, { id: "delete-class" });
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.message || "Failed to delete class", { id: "delete-class" });
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("An unexpected error occurred.", { id: "delete-class" });
    }
  };

  if (!classes || classes.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
        No classes configured for this event. Click "Add Class" to add one.
      </div>
    );
  }

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
          {classes.map((item, index) => (
            <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <td className="px-8 py-6">
                <span className="text-[15px] font-bold text-gray-900">{item.name}</span>
              </td>
              <td className="px-8 py-6">
                <span
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[13px] font-semibold capitalize inline-block text-center min-w-[100px]",
                    item.status === "pending" && "bg-yellow-50 text-yellow-700 border border-yellow-200/50",
                    item.status === "live" && "bg-blue-50 text-blue-700 border border-blue-200/50 animate-pulse",
                    item.status === "completed" && "bg-green-50 text-green-700 border border-green-200/50"
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 outline-none p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1">
                    {item.status !== "pending" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.name, "pending")}
                        className="text-gray-600 cursor-pointer py-2.5 rounded-md focus:bg-gray-50 font-medium"
                      >
                        Mark As Pending
                      </DropdownMenuItem>
                    )}
                    {item.status !== "live" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.name, "live")}
                        className="text-gray-600 cursor-pointer py-2.5 rounded-md focus:bg-gray-50 font-medium"
                      >
                        Mark As Live
                      </DropdownMenuItem>
                    )}
                    {item.status !== "completed" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(item.name, "completed")}
                        className="text-gray-600 cursor-pointer py-2.5 rounded-md focus:bg-gray-50 font-medium"
                      >
                        Mark As Completed
                      </DropdownMenuItem>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteClass(item.name)}
                      className="text-red-600 focus:text-red-700 cursor-pointer py-2.5 rounded-md focus:bg-red-50 font-medium"
                    >
                      Delete Class
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
