import { EventCard } from "@/components/events/EventCard";
import { AddEventModal } from "@/components/events/AddEventModal";
import { Plus } from "lucide-react";

export default function EventsView({ events }: { events: any[] }) {
  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
        <AddEventModal>
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </AddEventModal>
      </div>

      {/* Event List */}
      <div className="flex flex-col">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
            tags={event.tags}
          />
        ))}
      </div>
    </div>
  );
}
