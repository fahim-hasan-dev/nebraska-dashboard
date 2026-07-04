"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string; // ISO string or local date-time string
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
  className,
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Extract date (YYYY-MM-DD) and time (HH:mm) from value
  const [datePart, setDatePart] = React.useState("");
  const [timePart, setTimePart] = React.useState("");

  React.useEffect(() => {
    if (value) {
      try {
        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
          const dd = String(dateObj.getDate()).padStart(2, "0");
          const hh = String(dateObj.getHours()).padStart(2, "0");
          const min = String(dateObj.getMinutes()).padStart(2, "0");
          setDatePart(`${yyyy}-${mm}-${dd}`);
          setTimePart(`${hh}:${min}`);
          return;
        }
      } catch (e) {
        // Ignore
      }
    }
    setDatePart("");
    setTimePart("");
  }, [value, open]);

  const handleConfirm = () => {
    if (!datePart) {
      onChange("");
      setOpen(false);
      return;
    }
    const time = timePart || "00:00";
    const [hh, min] = time.split(":");
    const [yyyy, mm, dd] = datePart.split("-");
    
    // Construct local Date and emit ISO string
    const dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min));
    onChange(dateObj.toISOString());
    setOpen(false);
  };

  const displayString = React.useMemo(() => {
    if (!value) return "";
    try {
      const dateObj = new Date(value);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch {
      // Ignore
    }
    return value;
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 items-center justify-between cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn(!value && "text-gray-400 font-normal")}>
            {displayString || placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 flex flex-col gap-4 border-gray-250 bg-white shadow-xl rounded-xl" align="start">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Select Date
          </label>
          <input
            type="date"
            value={datePart}
            onChange={(e) => setDatePart(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Select Time
          </label>
          <input
            type="time"
            value={timePart}
            onChange={(e) => setTimePart(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-150 mt-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 h-9 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-9 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-md font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
