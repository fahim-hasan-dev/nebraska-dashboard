"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Edit, UploadCloud, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import BaseModal from "@/components/ui/BaseModal";
import AddressInput from "@/components/ui/AddressInput";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import { fetchImageAsBase64 } from "@/app/actions/imageActions";

// Local image preview helper component
interface NewImagePreviewProps {
  file: File;
  onRemove: () => void;
}

function NewImagePreview({ file, onRemove }: NewImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="relative aspect-video rounded-lg border border-gray-205 overflow-hidden group shadow-sm animate-fadeIn">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer"
        title="Remove image"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Format date helper matching original pattern
const formatToDatetimeLocal = (dateStr: string) => {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return "";
  
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

interface EditEventModalProps {
  event: any;
  onSuccess: () => void;
}

export default function EditEventModal({ event, onSuccess }: EditEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form input states
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingPictures, setExistingPictures] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form fields when modal opens or event data changes
  useEffect(() => {
    if (event && isOpen) {
      setName(event.name || "");
      setStartDate(formatToDatetimeLocal(event.startDate));
      setEndDate(formatToDatetimeLocal(event.endDate));
      setVenue(event.venue || "");
      setAdditionalInfo(event.additionalInfo || "");
      setExistingPictures(event.pictures || []);
      setSelectedFiles([]);

      if (event.location?.coordinates && event.location.coordinates.length === 2) {
        setCoordinates({
          lng: event.location.coordinates[0],
          lat: event.location.coordinates[1],
        });
      } else {
        setCoordinates(null);
      }
    }
  }, [event, isOpen]);

  const removeExistingPicture = (index: number) => {
    setExistingPictures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingCapacity = 8 - existingPictures.length;
      if (remainingCapacity <= 0) {
        toast.error("You have reached the limit of 8 images. Remove existing images to upload new ones.");
        return;
      }
      setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, remainingCapacity));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !startDate || !endDate || !venue) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!coordinates) {
      toast.error("Please select a valid venue location from the address suggestions");
      return;
    }

    setIsUpdating(true);
    toast.loading("Updating event details...", { id: "edit-event" });

    try {
      const formData = new FormData();
      const filesToUpload: File[] = [...selectedFiles];

      // Re-download existing pictures to append as File objects to avoid overwrite inside target API
      if (selectedFiles.length > 0 && existingPictures.length > 0) {
        toast.loading("Preparing existing images...", { id: "edit-event" });
        for (let i = 0; i < existingPictures.length; i++) {
          const picUrl = existingPictures[i];
          const absoluteUrl = getImageUrl(picUrl);
          try {
            const res = await fetchImageAsBase64(absoluteUrl);
            if (res) {
              const byteCharacters = atob(res.base64);
              const byteNumbers = new Array(byteCharacters.length);
              for (let j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: res.contentType });
              
              const urlPath = picUrl.split("?")[0];
              const filename = urlPath.substring(urlPath.lastIndexOf("/") + 1) || `existing-image-${i}.jpg`;
              
              const file = new File([blob], filename, { type: res.contentType });
              filesToUpload.push(file);
            }
          } catch (err) {
            console.error(`Failed to fetch existing picture at ${absoluteUrl}:`, err);
          }
        }
        toast.loading("Updating event details...", { id: "edit-event" });
      }

      const dataPayload = {
        name,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        venue,
        location: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
        additionalInfo,
        pictures: existingPictures,
      };

      formData.append("data", JSON.stringify(dataPayload));
      filesToUpload.forEach((file) => {
        formData.append("pictures", file);
      });

      const response = await myFetch(`/event/${event._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.success) {
        toast.success("Event updated successfully!", { id: "edit-event" });
        setIsOpen(false);
        onSuccess();
      } else {
        toast.error(response.message || "Failed to update event", { id: "edit-event" });
      }
    } catch (err) {
      console.error("Error updating event:", err);
      toast.error("An unexpected error occurred. Please try again.", { id: "edit-event" });
    } finally {
      setIsUpdating(false);
    }
  };

  const coordLng = event?.location?.coordinates?.[0];
  const coordLat = event?.location?.coordinates?.[1];

  const initCoordinates = useMemo(() => {
    if (coordLng !== undefined && coordLat !== undefined) {
      return {
        lng: coordLng,
        lat: coordLat,
      };
    }
    return null;
  }, [coordLng, coordLat]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm w-full sm:w-auto justify-center active:scale-[0.98] cursor-pointer"
      >
        <Edit className="w-4 h-4 text-gray-500" />
        Edit Event
      </button>

      <BaseModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        maxWidthClassName="sm:max-w-[600px]"
        title="Edit Event Details"
      >
        <div className="flex flex-col gap-5">
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

          {/* Venue Autocomplete Input */}
          <AddressInput
            label="Venue *"
            placeholder="Search address..."
            value={venue}
            onChange={setVenue}
            onCoordinatesChange={setCoordinates}
            initialCoordinates={initCoordinates}
            required={true}
          />

          {/* Pictures Display previews */}
          {(existingPictures.length > 0 || selectedFiles.length > 0) && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tractor Pictures ({existingPictures.length + selectedFiles.length})
              </label>
              <div className="grid grid-cols-4 gap-2">
                {/* Existing pictures */}
                {existingPictures.map((pic, idx) => (
                  <div
                    key={`existing-${idx}`}
                    className="relative aspect-video rounded-lg border border-gray-200 overflow-hidden group shadow-sm animate-fadeIn"
                  >
                    <img
                      src={getImageUrl(pic)}
                      alt={`Existing ${pic}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPicture(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* New images */}
                {selectedFiles.map((file, idx) => (
                  <NewImagePreview
                    key={`new-${idx}`}
                    file={file}
                    onRemove={() => removeFile(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* File input clicker wrapper */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Add Tractor Pictures (Max {Math.max(0, 8 - existingPictures.length)})
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
              disabled={8 - existingPictures.length <= 0}
            />
            <div
              onClick={() => {
                if (8 - existingPictures.length <= 0) {
                  toast.error("You have reached the limit of 8 images. Remove existing images to upload new ones.");
                  return;
                }
                fileInputRef.current?.click();
              }}
              className={`border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                8 - existingPictures.length <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-600">
                {8 - existingPictures.length <= 0 ? "Maximum limit reached" : "Click to upload images"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedFiles.length} / {Math.max(0, 8 - existingPictures.length)} new images selected
              </p>
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
              className="flex min-h-[140px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Form action triggers */}
          <div className="flex justify-between items-center mt-2 gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}
