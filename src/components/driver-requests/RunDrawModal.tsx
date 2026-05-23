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

interface RunDrawModalProps {
  children: React.ReactNode;
  eventId?: string;
  className?: string;
  onSuccess?: () => void;
}

export function RunDrawModal({ children, eventId, className, onSuccess }: RunDrawModalProps) {
  const [open, setOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishDraw = async () => {
    if (!eventId || !className) {
      toast.error("Please select a specific Event and Class first");
      return;
    }
    
    setIsPublishing(true);
    try {
      const response = await myFetch("/event-registration/draw", {
        method: "POST",
        body: {
          eventId,
          class: className,
        },
      });

      if (response.success) {
        toast.success("Pulling order positions randomized successfully!");
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Failed to publish draw");
      }
    } catch (error) {
      console.error("Error drawing positions:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-6 border-gray-200">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Competitor Drawing Order
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Randomize and assign pulling order positions to all approved competitors in class <strong className="text-gray-900">"{className}"</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePublishDraw}
            disabled={isPublishing}
            className="w-full px-4 py-2.5 bg-[#3b82f6] text-white rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isPublishing ? "Randomizing..." : "Randomize & Publish Order"}
          </button>
          
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
