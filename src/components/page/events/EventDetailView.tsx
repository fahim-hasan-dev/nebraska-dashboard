"use client";

import { ArrowLeft, Plus, Calendar, MapPin, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ClassTable } from "@/components/events/ClassTable";
import { AddClassModal } from "@/components/events/AddClassModal";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import EditEventModal from "./EditEventModal";

interface IClassItem {
  name: string;
  status: "pending" | "live" | "completed";
}

interface IEventDetails {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  additionalInfo?: string;
  class?: IClassItem[];
  pictures?: string[];
  isRegistered?: boolean;
}

const getSafeDisplayDateTime = (dateStr: string) => {
  if (!dateStr) return "N/A";
  try {
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    // Ignore and fallback
  }
  return dateStr;
};

interface EventDetailViewProps {
  eventId: string;
}

export default function EventDetailView({ eventId }: EventDetailViewProps) {
  const router = useRouter();
  const [event, setEvent] = useState<IEventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const displayStartDate = event.startDate ? getSafeDisplayDateTime(event.startDate) : "N/A";
  const displayEndDate = event.endDate ? getSafeDisplayDateTime(event.endDate) : "N/A";

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto p-6 md:p-10 pb-20 md:pb-28">
      {/* Top Navigation */}
      <div className="flex items-start sm:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6 flex-col sm:flex-row w-full">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            onClick={() => router.push("/events")}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 border border-gray-100 shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col justify-center h-full min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-words">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end shrink-0">
          {/* Event Completed Label */}
          {event.class && event.class.length > 0 && event.class.every((c: IClassItem) => c.status === "completed") && (
            <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm select-none">
              ✓ Event Completed
            </span>
          )}
          <EditEventModal event={event} onSuccess={fetchEventDetails} />
        </div>
      </div>

      {/* Main Details and Media Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Info Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Additional Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Additional Information
            </h3>
            <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line font-medium">
              {event.additionalInfo || "No details provided."}
            </p>
          </div>

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
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">Start Date & Time</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">{displayStartDate}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 border border-blue-100/50 rounded-xl shadow-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-gray-500 font-medium uppercase tracking-wide">End Date & Time</span>
                <span className="text-[15px] font-bold text-gray-900 mt-0.5">{displayEndDate}</span>
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
