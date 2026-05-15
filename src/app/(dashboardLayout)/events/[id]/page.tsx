import EventDetailView from "@/components/page/events/EventDetailView";
import { demoEventsData } from "@/demoData/events";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Find event from demo data
  const event = demoEventsData.find((e) => e.id.toString() === id);

  if (!event) {
    notFound();
  }

  return <EventDetailView event={event} />;
}
