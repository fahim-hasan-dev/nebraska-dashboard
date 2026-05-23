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
import { ChevronDown, UserPlus } from "lucide-react";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";

export function AddDriverModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");

  const classesList = selectedEvent?.class || [];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        // Reset when closed
        setSelectedEventId("");
        setSelectedEvent(null);
        setSelectedClassName("");
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 rounded-2xl overflow-hidden bg-white shadow-xl">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#3b82f6]" />
            Add New Driver Request
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>
        
        <div className="px-6 py-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600">
                Driver Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-600">
                Vehicle Name
              </label>
              <input
                type="text"
                placeholder="e.g. Iron Beast"
                className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Hometown
            </label>
            <input
              type="text"
              placeholder="e.g. Lincoln, NE"
              className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all font-medium"
            />
          </div>

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
                onChange={(e) => setSelectedClassName(e.target.value)}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              placeholder="driver@example.com"
              className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="e.g. (402) 555-0199"
              className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-600">
              Optional Notes
            </label>
            <textarea
              placeholder="Provide any additional notes here..."
              className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all resize-none font-medium"
            />
          </div>

          <div className="flex gap-4 mt-2">
            <button className="flex-1 h-12 bg-[#3b82f6] text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-sm active:scale-[0.99]">
              Add Driver
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors active:scale-[0.99]"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
