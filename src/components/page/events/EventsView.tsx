/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import { AddEventModal } from "@/components/events/AddEventModal";
import { Plus } from "lucide-react";
import { myFetch } from "@/utils/myFetch";

interface EventsViewProps {
  initialEvents: any[];
}

export default function EventsView({ initialEvents }: EventsViewProps) {
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from backend API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await myFetch("/event", {
        method: "GET",
        cache: "no-store",
      });
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Keep state synced with server-side props if they change
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  // Format events to fit EventCard component props
  const formattedEvents = events.map((event: any) => {
    // Extract date and time safely
    let displayDate = event.date || "";
    if (event.time) {
      displayDate = `${displayDate} at ${event.time}`;
    }

    // Extract tags from the class list objects
    const tags = event.class?.map((c: any) => c.name) || [];

    return {
      id: event.id || event._id,
      title: event.name || "Untitled Event",
      date: displayDate,
      location: event.venue || "TBD Location",
      description: event.additionalInfo || "No details provided.",
      tags: tags.length > 0 ? tags : ["Standard"],
    };
  });

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your races, pull championships, and competitor classes.
          </p>
        </div>
        <AddEventModal onSuccess={fetchEvents}>
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm w-full sm:w-auto justify-center active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </AddEventModal>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-10 text-gray-500 text-sm font-medium">
          Refreshing event list...
        </div>
      )}

      {/* Event List */}
      {!isLoading && formattedEvents.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 mt-4">
          No events found. Click "Add Event" to get started!
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {formattedEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              tags={event.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
