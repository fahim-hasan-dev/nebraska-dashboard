/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import { AddEventModal } from "@/components/events/AddEventModal";
import { Plus, Search, Loader2 } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import { CustomPagination } from "@/components/ui/custom-pagination";

interface EventsViewProps {
  initialEvents: any[];
  initialPagination?: any;
}

export default function EventsView({ initialEvents, initialPagination }: EventsViewProps) {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedFromApi, setHasLoadedFromApi] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialPagination?.totalPage || 1);
  const [totalItems, setTotalItems] = useState(initialPagination?.total || 0);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query changes to prevent heavy server load
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch events from backend API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "15");
      if (debouncedSearchQuery) {
        params.append("searchTerm", debouncedSearchQuery);
      }

      const response = await myFetch(`/event?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (response.success && response.data) {
        // Handle paginated QueryBuilder results or pure arrays
        const list = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
        setEventsList(list);
        setHasLoadedFromApi(true);

        if (response.pagination) {
          setTotalPages(response.pagination.totalPage || 1);
          setTotalItems(response.pagination.total || list.length);
        } else {
          setTotalPages(1);
          setTotalItems(list.length);
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch events when active page page shifts
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reset page to 1 when search query changes
  useEffect(() => {
    if (page === 1) {
      fetchEvents();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  // Local/Remote filtering
  const sourceList = hasLoadedFromApi ? eventsList : initialEvents;

  // Format events to fit EventCard component props
  const formattedEvents = sourceList.map((event: any) => {
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
      entryFee: event.entryFee || 0,
    };
  });

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
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

      {/* Search Bar */}
      <div className="relative max-w-[400px] mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Event List / Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          Loading events...
        </div>
      ) : formattedEvents.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 mt-4">
          No events found. Click "Add Event" to get started!
        </div>
      ) : (
        <>
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
                entryFee={event.entryFee}
              />
            ))}
          </div>

          {/* Dynamic Pagination */}
          <CustomPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
