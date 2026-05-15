"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function AddClassModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 border-gray-200">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Create Class
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Class *
            </label>
            <input
              type="text"
              placeholder="e.g., Spring Championship 2026"
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mt-2 gap-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 h-12 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 h-12 px-4 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors">
              Create Class
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
