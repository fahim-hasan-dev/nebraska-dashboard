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
import { ChevronDown, UserPlus, Loader2 } from "lucide-react";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface AddDriverModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddDriverModal({ children, onSuccess }: AddDriverModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedTractor, setSelectedTractor] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesList = selectedEvent?.class || [];

  const handleRegisterDriver = async () => {
    if (!selectedEventId || !selectedClassName || !selectedDriverId || !selectedTractor) {
      toast.error("Please select all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await myFetch("/event-registration/admin-add", {
        method: "POST",
        body: {
          event: selectedEventId,
          class: selectedClassName,
          driver: selectedDriverId,
          tractor: selectedTractor,
          note: note.trim() || undefined,
        },
      });

      if (res.success) {
        toast.success("Driver added to event successfully!");
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(res.message || "Failed to add driver.");
      }
    } catch (error) {
      console.error("Error submitting driver registration:", error);
      toast.error("An error occurred while adding driver.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        // Reset state on close
        setSelectedEventId("");
        setSelectedEvent(null);
        setSelectedClassName("");
        setSelectedDriverId("");
        setSelectedDriver(null);
        setSelectedTractor("");
        setNote("");
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#3b82f6]" />
            Add New Driver Request
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>
        
        <div className="px-6 py-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          {/* Event Searchable infinite select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Championship Event
            </label>
            <SearchableInfiniteSelect
              endpoint="/event"
              fields="_id,name,class"
              placeholder="Select Event"
              value={selectedEventId}
              onChange={(value, event) => {
                setSelectedEventId(value);
                setSelectedEvent(event);
                setSelectedClassName(""); // Reset class when event changes
                setSelectedDriverId(""); // Reset driver when event changes
              }}
              displayValue={(evt) => evt.name}
            />
          </div>

          {/* Dynamic Class select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Class
            </label>
            <div className="relative">
              <select
                value={selectedClassName}
                disabled={!selectedEventId}
                onChange={(e) => {
                  setSelectedClassName(e.target.value);
                  setSelectedDriverId(""); // Reset driver when class changes
                }}
                className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                <option value="" disabled>
                  {!selectedEventId ? "Select event first" : "Select Class"}
                </option>
                {classesList.map((cls: any, idx: number) => {
                  const key = cls._id || cls.id || cls.name || idx;
                  return (
                    <option key={key} value={cls.name || cls}>
                      {cls.name || cls}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Driver Searchable infinite select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Driver *
            </label>
            <SearchableInfiniteSelect
              endpoint="/user"
              fields="_id,email,fullName,tractorName,phone"
              extraParams={{ role: "driver" }}
              placeholder="Select Driver"
              disabled={false}
              value={selectedDriverId}
              onChange={(value, driver) => {
                setSelectedDriverId(value);
                setSelectedDriver(driver);
                setSelectedTractor(""); // Reset tractor when driver changes
              }}
              displayValue={(driver) =>
                `${driver.fullName}${driver.tractorName && driver.tractorName.length > 0 ? ` (${driver.tractorName.join(", ")})` : ""}${
                  driver.phone ? ` - ${driver.phone}` : ""
                }`
              }
            />
          </div>

          {/* Dynamic Tractor Select Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Tractor *
            </label>
            <div className="relative">
              <select
                value={selectedTractor}
                disabled={!selectedDriverId}
                onChange={(e) => setSelectedTractor(e.target.value)}
                className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                <option value="" disabled>
                  {!selectedDriverId ? "Select driver first" : "Select Tractor"}
                </option>
                {selectedDriver?.tractorName?.map((tractor: string, idx: number) => (
                  <option key={idx} value={tractor}>
                    {tractor}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Note Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Optional Notes
            </label>
            <textarea
              placeholder="Provide any additional notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
              className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all resize-none font-medium disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleRegisterDriver}
              disabled={isSubmitting || !selectedEventId || !selectedClassName || !selectedDriverId}
              className="flex-1 h-12 bg-[#3b82f6] text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Driver
            </button>
            <button
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors active:scale-[0.99] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
