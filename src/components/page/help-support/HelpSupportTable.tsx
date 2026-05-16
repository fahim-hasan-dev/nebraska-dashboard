/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, MapPin, MoreHorizontal, Phone, Mail, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HelpSupportTableProps {
  tickets: any[];
  onView: (ticket: any) => void;
}

export function HelpSupportTable({ tickets, onView }: HelpSupportTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-6 font-semibold">USER</th>
              <th className="px-6 py-6 font-semibold">TITLE</th>
              <th className="px-6 py-6 font-semibold">CONTACT</th>
              <th className="px-6 py-6 font-semibold">STATUS</th>
              <th className="px-6 py-6 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tickets?.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-gray-900">{row.user.name}</span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md text-[11px] font-medium">
                        {row.user.location}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-gray-900">
                  {row.title}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{row.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-[12px]">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{row.contact.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {row.status === "Solved" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-500">
                      Solved
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-500">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600 outline-none p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-1">
                      <DropdownMenuItem
                        onClick={() => onView(row)}
                        className="text-gray-600 cursor-pointer py-2 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Request
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 focus:text-red-600 cursor-pointer py-2 focus:bg-red-50 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Remove Request
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="flex justify-center items-center py-6 border-t border-gray-50 gap-2">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
          ←
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-medium text-sm">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-medium text-sm">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-medium text-sm">
          3
        </button>
        <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 font-medium text-sm">
          10
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
          →
        </button>
      </div>
    </div>
  );
}
