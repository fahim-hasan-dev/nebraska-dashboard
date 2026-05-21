import { MoreHorizontal, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface DriverRequestsTableProps {
  data: any[];
  onAccept?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function DriverRequestsTable({ data, onAccept, onDelete }: DriverRequestsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-6 font-semibold">ORDER (DRAW)</th>
              <th className="px-6 py-6 font-semibold">USER</th>
              <th className="px-6 py-6 font-semibold">CLASS</th>
              <th className="px-6 py-6 font-semibold">EMAIL & PHONE</th>
              <th className="px-6 py-6 font-semibold">VEHICLE</th>
              <th className="px-6 py-6 font-semibold">STATUS</th>
              <th className="px-6 py-6 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                  No driver registrations found.
                </td>
              </tr>
            ) : (
              data?.map((row, idx) => {
                const driverName = row.driver?.fullName || "Unknown Driver";
                const eventName = row.event?.name || "N/A";
                const phone = row.driver?.phone || "N/A";
                const email = row.driver?.email || "N/A";
                const vehicle = row.driver?.vehicleName || "N/A";
                const regId = row._id || row.id;

                return (
                  <tr key={regId} className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-medium ${
                        row.drawPosition ? "bg-purple-600" : "bg-gray-400"
                      }`}>
                        {row.drawPosition || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-gray-900">{driverName}</span>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium w-fit">
                          {eventName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900">
                      {row.class}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[12px]">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate max-w-[180px]">{email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900">
                      {vehicle}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        row.status === "approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : row.status === "rejected"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600 outline-none p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          {row.status !== "approved" && (
                            <DropdownMenuItem
                              onClick={() => onAccept && onAccept(regId)}
                              className="text-gray-600 cursor-pointer py-2"
                            >
                              Accept Request
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onDelete && onDelete(regId)}
                            className="text-red-500 focus:text-red-600 cursor-pointer py-2 focus:bg-red-50"
                          >
                            Remove Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
