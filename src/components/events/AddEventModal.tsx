"use client";

import { UploadCloud, Plus, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getAddressSuggestions, getPlaceCoordinates } from "@/app/actions/mapActions";
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
import { DateTimePicker } from "@/components/ui/DateTimePicker";

interface AddEventModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddEventModal({ children, onSuccess }: AddEventModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [oneTimeHookFee, setOneTimeHookFee] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [classes, setClasses] = useState<string[]>([""]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map and Address Autocomplete states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVenueChange = async (val: string) => {
    setVenue(val);
    setCoordinates(null); // Reset coordinates when user types
    if (val.trim().length >= 3) {
      setIsSearchingSuggestions(true);
      const results = await getAddressSuggestions(val);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearchingSuggestions(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    if (suggestion.placeId === "error") {
      setShowSuggestions(false);
      return;
    }
    setVenue(suggestion.description);
    setShowSuggestions(false);
    toast.loading("Locating coordinates...", { id: "locate-coords" });
    const coords = await getPlaceCoordinates(suggestion.placeId);
    if (coords) {
      setCoordinates(coords);
      toast.success("Location locked!", { id: "locate-coords" });
    } else {
      toast.error("Failed to retrieve coordinates for this address", { id: "locate-coords" });
    }
  };

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
    if (!name || !startDate || !endDate || !venue || !oneTimeHookFee) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    if (!coordinates) {
      toast.error("Please select a valid venue location from the address suggestions");
      return;
    }

    if (isNaN(Number(oneTimeHookFee)) || Number(oneTimeHookFee) <= 0) {
      toast.error("Please enter a valid positive one time hook fee");
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
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        venue,
        location: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat], // [longitude, latitude]
        },
        oneTimeHookFee: Number(oneTimeHookFee),
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
        setStartDate("");
        setEndDate("");
        setVenue("");
        setCoordinates(null);
        setOneTimeHookFee("");
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

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Start Date & Time *
              </label>
              <DateTimePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Select start date & time"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                End Date & Time *
              </label>
              <DateTimePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Select end date & time"
              />
            </div>
          </div>

          {/* Venue & Hook Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 relative" ref={suggestionsRef}>
              <label className="text-sm font-medium text-gray-700">
                Venue *
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => handleVenueChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search address..."
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              
              {/* Location locked feedback */}
              {coordinates && (
                <span className="text-[10px] text-green-600 font-bold absolute right-2.5 top-8.5 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                  ✓ Geocoded
                </span>
              )}

              {/* Suggestions popover */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-[68px] z-50 bg-white border border-gray-250 rounded-xl shadow-xl max-h-52 overflow-y-auto divide-y divide-gray-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  {isSearchingSuggestions ? (
                    <div className="px-4 py-3 text-xs text-gray-400 font-medium flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      Searching addresses...
                    </div>
                  ) : suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-xs font-semibold text-gray-700 truncate block transition-colors"
                    >
                      {s.description}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                One Time Hook Fee ($) *
              </label>
              <input
                type="number"
                value={oneTimeHookFee}
                onChange={(e) => setOneTimeHookFee(e.target.value)}
                placeholder="e.g., 50"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
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

          {/* Additional Info */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional details about the event..."
              className="flex min-h-[140px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
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
