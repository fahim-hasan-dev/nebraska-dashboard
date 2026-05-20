"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface AddClassModalProps {
  children: React.ReactNode;
  eventId: string;
  onSuccess?: () => void;
}

export function AddClassModal({ children, eventId, onSuccess }: AddClassModalProps) {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = className.trim();
    if (!trimmedName) {
      toast.error("Class name cannot be empty");
      return;
    }

    setIsLoading(true);
    toast.loading("Adding class...", { id: "add-class" });

    try {
      const response = await myFetch(`/event/${eventId}/class`, {
        method: "POST",
        body: {
          name: trimmedName,
          status: "pending",
        },
      });

      if (response.success) {
        toast.success("Class added successfully!", { id: "add-class" });
        setClassName("");
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || "Failed to add class", { id: "add-class" });
      }
    } catch (error) {
      console.error("Error adding class:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: "add-class" });
    } finally {
      setIsLoading(false);
    }
  };

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
              Class Name *
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Pro Class, Junior Class"
              className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-between items-center mt-2 gap-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1 h-12 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 h-12 px-4 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
