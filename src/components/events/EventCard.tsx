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
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="border-t border-gray-100" />
      <div className="p-4 px-6 flex justify-between items-center bg-white">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 outline-none p-1 rounded-md hover:bg-gray-50">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/events/${id}`} className="w-full cursor-pointer">
                  Class
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-600 cursor-pointer py-2">
                Mark As Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
