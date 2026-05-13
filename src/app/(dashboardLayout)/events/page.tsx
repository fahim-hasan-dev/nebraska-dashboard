import EventsView from "@/components/page/events/EventsView";
import { demoEventsData } from "@/demoData/events";

const EventsPage = async () => {
  return (
    <>
      <EventsView events={demoEventsData as never[]} />
    </>
  );
};

export default EventsPage;

