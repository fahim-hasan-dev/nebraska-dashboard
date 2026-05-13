"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { HelpSupportTable } from "@/components/page/help-support/HelpSupportTable";
import { HelpSupportDetail } from "@/components/page/help-support/HelpSupportDetail";

export default function HelpSupportView({ tickets }: { tickets: any[] }) {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto pb-20">
      {/* Page Header (Hidden in detail view if you want to mimic full screen detail, but design shows it might remain, actually let's keep it based on screenshot) */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Help & Support
        </h1>
        {selectedTicket ? null : (
          <p className="text-sm text-gray-500">
            Solve the problems of the users.
          </p>
        )}
      </div>

      {!selectedTicket ? (
        <div className="flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative max-w-[400px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-100 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Table */}
          <HelpSupportTable tickets={tickets} onView={(ticket) => setSelectedTicket(ticket)} />
        </div>
      ) : (
        <HelpSupportDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}
