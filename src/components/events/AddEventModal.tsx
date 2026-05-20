"use client";

import { UploadCloud, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface AddEventModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddEventModal({ children, onSuccess }: AddEventModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [classes, setClasses] = useState<string[]>([""]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic class field handlers
  const handleClassChange = (index: number, value: string) => {
    const updated = [...classes];
    updated[index] = value;
    setClasses(updated);
  };

  const addClassField = () => {
    setClasses([...classes, ""]);
  };

  const removeClassField = (index: number) => {
    if (classes.length > 1) {
      setClasses(classes.filter((_, i) => i !== index));
    }
  };

  // Trigger local file selection
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, 8)); // Limit to max 8 files
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the form
  const handleSubmit = async () => {
    // Validation
    if (!name || !date || !time || !venue) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    const activeClasses = classes.map((c) => c.trim()).filter(Boolean);
    if (activeClasses.length === 0) {
      toast.error("At least one class is required");
      return;
    }

    setIsLoading(true);
    toast.loading("Creating event...", { id: "create-event" });

    try {
      const formData = new FormData();

      // Create the JSON payload that matches createEventZodSchema validation
      const dataPayload = {
        name,
        date,
        time,
        venue,
        additionalInfo,
        class: activeClasses.map((className) => ({
          name: className,
          status: "pending",
        })),
      };

      // Append JSON payload under 'data' key as expected by backend parser
      formData.append("data", JSON.stringify(dataPayload));

      // Append each selected image file under 'pictures' key
      selectedFiles.forEach((file) => {
        formData.append("pictures", file);
      });

      const response = await myFetch("/event/create", {
        method: "POST",
        body: formData,
      });

      if (response.success) {
        toast.success("Event created successfully!", { id: "create-event" });
        setOpen(false);
        // Reset states
        setName("");
        setDate("");
        setTime("");
        setVenue("");
        setAdditionalInfo("");
        setClasses([""]);
        setSelectedFiles([]);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || response.error || "Failed to create event", { id: "create-event" });
      }
    } catch (error: unknown) {
      console.error("Error creating event:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: "create-event" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">
            Create New Event
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>
        <div className="p-6 flex flex-col gap-5">
          {/* Event Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Event Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spring Championship 2026"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Venue *
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g., County Fairgrounds"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dynamic Classes Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Classes *
              </label>
              <button
                type="button"
                onClick={addClassField}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors outline-none focus:ring-2 focus:ring-blue-100 rounded px-1.5 py-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Class
              </button>
            </div>
            
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
              {classes.map((cls, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cls}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                    placeholder={`e.g., Pro Class, Junior Class`}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 animate-fadeIn"
                    required
                  />
                  {classes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClassField(index)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md border border-gray-200 hover:border-red-200 transition-colors"
                      title="Remove class"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional details about the event..."
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Upload for Tractor Pictures */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Tractor Pictures (Max 8)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-600">
                Click to upload images
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedFiles.length} / 8 images selected
              </p>
            </div>

            {/* Display Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md pl-3 pr-2 py-1 text-xs text-gray-600"
                  >
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-between items-center mt-2 gap-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
