export const dynamic = "force-dynamic";

import EventsView from "@/components/page/events/EventsView";
import { myFetch } from "@/utils/myFetch";

const EventsPage = async () => {
  let initialEvents = [];
  let initialPagination: any = null;
  
  try {
    // Fetch initial 5 events from backend server
    const response = await myFetch("/event?page=1&limit=15", {
      method: "GET",
      cache: "no-store", // Ensure server-side fetch is dynamic
    });

    if (response.success && response.data) {
      initialEvents = response.data;
      initialPagination = response.pagination || null;
    }
  } catch (error) {
    console.error("Error fetching initial events on server-side:", error);
  }

  return (
    <>
      <EventsView initialEvents={initialEvents} initialPagination={initialPagination} />
    </>
  );
};

export default EventsPage;
