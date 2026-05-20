import EventsView from "@/components/page/events/EventsView";
import { myFetch } from "@/utils/myFetch";

const EventsPage = async () => {
  let initialEvents = [];
  
  try {
    // Fetch all events from backend server
    const response = await myFetch("/event", {
      method: "GET",
      cache: "no-store", // Ensure server-side fetch is dynamic
    });

    if (response.success && response.data) {
      initialEvents = response.data;
    }
  } catch (error) {
    console.error("Error fetching initial events on server-side:", error);
  }

  return (
    <>
      <EventsView initialEvents={initialEvents} />
    </>
  );
};

export default EventsPage;
