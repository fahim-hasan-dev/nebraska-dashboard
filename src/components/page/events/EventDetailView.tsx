"use client";

import { ArrowLeft, Plus, Edit, Calendar, MapPin, Clock, UploadCloud, X, AlertCircle, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ClassTable } from "@/components/events/ClassTable";
import { AddClassModal } from "@/components/events/AddClassModal";
import { myFetch } from "@/utils/myFetch";
import { config } from "@/config/env-config";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageUrl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface EventDetailViewProps {
  eventId: string;
}

export default function EventDetailView({ eventId }: EventDetailViewProps) {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editVenue, setEditVenue] = useState("");
  const [editEntryFee, setEditEntryFee] = useState("");
  const [editAdditionalInfo, setEditAdditionalInfo] = useState("");
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const fetchEventDetails = async () => {
    setIsLoading(true);
    try {
      const response = await myFetch(`/event/${eventId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (response.success && response.data) {
        setEvent(response.data);
        setError(null);
        
        // Initialize Edit Fields
        setEditName(response.data.name || "");
        if (response.data.date) {
          const dateObj = new Date(response.data.date);
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          setEditDate(`${yyyy}-${mm}-${dd}`);
        } else {
          setEditDate("");
        }
        setEditTime(response.data.time || "");
        setEditVenue(response.data.venue || "");
        setEditEntryFee(String(response.data.entryFee || ""));
        setEditAdditionalInfo(response.data.additionalInfo || "");
      } else {
        setError(response.message || "Failed to load event details");
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const handleMarkEventCompleted = async () => {
    if (!event || !event.class || event.class.length === 0) return;
    
    const uncompletedClasses = event.class.filter((c: any) => c.status !== "completed");
    
    if (uncompletedClasses.length === 0) {
      toast.success("Event is already completed!");
      return;
    }
    
    setIsUpdating(true);
    toast.loading("Marking event as completed...", { id: "complete-event" });
    
    try {
      let allSuccess = true;
      for (const cls of uncompletedClasses) {
        const response = await myFetch(`/event/${eventId}/class/${encodeURIComponent(cls.name)}/status`, {
          method: "PATCH",
          body: { status: "completed" },
        });
        if (!response.success) {
          allSuccess = false;
        }
      }
      
      if (allSuccess) {
        toast.success("Event and all classes marked as completed!", { id: "complete-event" });
        fetchEventDetails();
      } else {
        toast.error("Failed to mark some classes as completed", { id: "complete-event" });
        fetchEventDetails();
      }
    } catch (error) {
      console.error("Error marking event as completed:", error);
      toast.error("An error occurred while marking event as completed", { id: "complete-event" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEditSelectedFiles((prev) => [...prev, ...filesArray].slice(0, 8));
    }
  };

  const removeEditFile = (index: number) => {
    setEditSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async () => {
    if (!editName || !editDate || !editTime || !editVenue || !editEntryFee) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate past date and time
    const selectedDateTime = new Date(`${editDate}T${editTime}`);
    if (selectedDateTime < new Date()) {
      toast.error("Event date and time cannot be in the past");
      return;
    }

    if (isNaN(Number(editEntryFee)) || Number(editEntryFee) <= 0) {
      toast.error("Please enter a valid positive entry fee");
      return;
    }

    setIsUpdating(true);
    toast.loading("Updating event details...", { id: "edit-event" });

    try {
      const formData = new FormData();
      const dataPayload = {
        name: editName,
        date: editDate,
        time: editTime,
        venue: editVenue,
        entryFee: Number(editEntryFee),
        additionalInfo: editAdditionalInfo,
      };

      formData.append("data", JSON.stringify(dataPayload));
      editSelectedFiles.forEach((file) => {
        formData.append("pictures", file);
      });

      const response = await myFetch(`/event/${eventId}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.success) {
        toast.success("Event updated successfully!", { id: "edit-event" });
        setIsEditOpen(false);
        setEditSelectedFiles([]);
        fetchEventDetails();
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

  if (isLoading && !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 text-sm font-medium">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-2xl border border-gray-100 max-w-[500px] mx-auto mt-10 shadow-sm">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Event</h2>
        <p className="text-gray-500 mb-6">{error || "Event not found"}</p>
        <button
          onClick={() => router.push("/events")}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          Back to Events List
        </button>
      </div>
    );
  }

  // Format Date for Display
  const displayDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto p-6 md:p-10 pb-20 md:pb-28">
      {/* Top Navigation */}
      <div className="flex items-start sm:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6 flex-col sm:flex-row">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/events")}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 border border-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
          {/* Mark As Completed Button */}
          {event.class && event.class.length > 0 && event.class.every((c: any) => c.status === "completed") ? (
            <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm select-none">
              ✓ Event Completed
            </span>
          ) : (
            <button
              onClick={handleMarkEventCompleted}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm justify-center active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              Mark As Completed
            </button>
          )}

          {/* Edit Event Details Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm w-full sm:w-auto justify-center active:scale-[0.98] cursor-pointer"
            >
              <Edit className="w-4 h-4 text-gray-500" />
              Edit Event
            </button>
          <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-gray-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Edit Event Details
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
                    value={editDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEditDate(e.target.value)}
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
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Venue & Entry Fee */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    placeholder="e.g., County Fairgrounds"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Entry Fee ($) *
                  </label>
                  <input
                    type="number"
                    value={editEntryFee}
                    onChange={(e) => setEditEntryFee(e.target.value)}
                    placeholder="e.g., 50"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  value={editAdditionalInfo}
                  onChange={(e) => setEditAdditionalInfo(e.target.value)}
                  placeholder="Any additional details about the event..."
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Picture Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Add Tractor Pictures (Max 8)
                </label>
                <input
                  type="file"
                  ref={editFileInputRef}
                  onChange={handleEditFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-600">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {editSelectedFiles.length} / 8 new images selected
                  </p>
                </div>

                {/* Previews */}
                {editSelectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editSelectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md pl-3 pr-2 py-1 text-xs text-gray-600 animate-fadeIn"
                      >
                        <span className="truncate max-w-[120px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEditFile(idx)}
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
                  onClick={() => setIsEditOpen(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Main Details and Media Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Info Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Picture Gallery */}
          {event.pictures && event.pictures.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Tractor & Event Media ({event.pictures.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {event.pictures.map((pic: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
                  >
                    <img
                      src={getImageUrl(pic)}
                      alt={`Event tractor ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic Information Sidebar */}
        <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-50 pb-4">
            Basic Information
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">Date</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">{displayDate}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">Time</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">{event.time || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">Venue</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">{event.venue || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">Entry Fee</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">${event.entryFee || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class List & Dynamic Actions Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Competitor Classes</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add new competitor groups or set statuses to live and completed.
            </p>
          </div>
          <AddClassModal eventId={eventId} onSuccess={fetchEventDetails}>
            <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm active:scale-[0.98]">
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </AddClassModal>
        </div>

        <ClassTable
          classes={event.class || []}
          eventId={eventId}
          onRefresh={fetchEventDetails}
        />
      </div>
    </div>
  );
}
