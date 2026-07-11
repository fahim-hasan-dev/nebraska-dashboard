import { Calendar, MapPin, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

interface EventCardProps {
  id: string | number;
  title: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
}

export function EventCard({
  id,
  title,
  date,
  location,
  description,
  tags,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {title}
        </h3>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2 gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{location}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
      <div className="border-t border-gray-100" />
      <div className="p-4 px-6 flex justify-between items-center bg-white">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/events/${id}`}
            className="flex items-center justify-center px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md font-medium text-xs hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            Manage Event
          </Link>
        </div>
      </div>
    </div>
  );
}
