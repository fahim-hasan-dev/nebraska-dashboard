/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eye, MapPin, MoreHorizontal, Phone, Mail, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/modals/DeleteModal";

interface HelpSupportTableProps {
  tickets: any[];
  onView: (ticket: any) => void;
  onDelete: (ticketId: string) => Promise<void>;
}

export function HelpSupportTable({ tickets, onView, onDelete }: HelpSupportTableProps) {
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
            {tickets?.map((row, index) => {
              const ticketId = row._id || row.id;
              const userName = row.user?.fullName || row.user?.name || "Anonymous User";
              const userRole = row.user?.role || "User";
              const userPhone = row.user?.phone || row.contact?.phone || "N/A";
              const userEmail = row.user?.email || row.contact?.email || "N/A";
              const isResolved = row.status === "resolved" || row.status === "Solved";

              return (
                <tr key={ticketId || index} className="bg-white hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-900">{userName}</span>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md text-[11px] font-medium capitalize">
                          {userRole}
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
                        <span>{userPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-[12px]">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {isResolved ? (
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
                        {row._id && (
                          <DeleteModal
                            itemId={row._id}
                            triggerBtn={
                              <div className="text-red-500 cursor-pointer py-2 flex items-center gap-2 px-2 hover:bg-red-50 text-sm font-medium rounded-sm">
                                <Trash2 className="w-4 h-4" />
                                Remove Request
                              </div>
                            }
                            title="Remove Support Request"
                            description="Are you sure you want to permanently remove this support ticket? This action cannot be undone."
                            actionBtnText="Remove"
                            action={onDelete}
                          />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
