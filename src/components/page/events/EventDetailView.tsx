"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ClassTable } from "@/components/events/ClassTable";
import { AddClassModal } from "@/components/events/AddClassModal";

interface EventDetailViewProps {
  event: {
    id: string | number;
    title: string;
    date: string;
    location: string;
  };
}

export default function EventDetailView({ event }: EventDetailViewProps) {
  const router = useRouter();

  // Mocked classes for demonstration
  const classes: any[] = [
    { id: 1, name: "Pro Class", status: "Pending" },
    { id: 2, name: "Pro Class", status: "Live" },
    { id: 3, name: "Pro Class", status: "Completed" },
    { id: 4, name: "Pro Class", status: "Completed" },
  ];

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto p-6 md:p-10">
      {/* Top Navigation */}
      <div className="flex items-center gap-6 mb-10">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
            {event.title}
          </h1>
          <p className="text-[14px] text-gray-500 font-medium">
            {event.date} - {event.location}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-8">
        <AddClassModal>
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-[14px] transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </AddClassModal>
      </div>

      {/* Content */}
      <ClassTable classes={classes} eventId={event.id} />
    </div>
  );
}
