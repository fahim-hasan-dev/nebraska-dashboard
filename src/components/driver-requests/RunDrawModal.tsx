"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RunDrawModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-6 border-gray-200 [&>button]:hidden">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Confirm Driver Draw Publish
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to publish the draw? This will randomly assign positions to all drivers.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Add publish logic here
              setOpen(false);
            }}
            className="flex-1 px-4 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors"
          >
            Publish Order
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
