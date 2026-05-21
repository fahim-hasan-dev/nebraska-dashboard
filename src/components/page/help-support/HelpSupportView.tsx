/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { HelpSupportTable } from "@/components/page/help-support/HelpSupportTable";
import { HelpSupportDetail } from "@/components/page/help-support/HelpSupportDetail";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

export default function HelpSupportView({ tickets }: { tickets: any[] }) {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (page <= 6) {
        for (let i = 1; i <= 8; i++) {
          range.push(i);
        }
        range.push("...");
        range.push(totalPages);
      } else if (page >= totalPages - 5) {
        range.push(1);
        range.push("...");
        for (let i = totalPages - 7; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        range.push(1);
        range.push("...");
        for (let i = page - 3; i <= page + 3; i++) {
          range.push(i);
        }
        range.push("...");
        range.push(totalPages);
      }
    }
    return range;
  };

  // Fetch help support tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "15");
      if (searchQuery) {
        params.append("searchTerm", searchQuery);
      }

      const res = await myFetch(`/help-support?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.success && res.data) {
        // Handle paginated QueryBuilder results or pure arrays
        const list = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);
        setTicketsList(list);

        if (res.pagination) {
          setTotalPages(res.pagination.totalPage || 1);
          setTotalItems(res.pagination.total || list.length);
        } else {
          setTotalPages(1);
          setTotalItems(list.length);
        }
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Failed to load tickets from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reset page to 1 when search changes. If it is already 1, trigger manual fetch to update results immediately.
  useEffect(() => {
    if (page === 1) {
      fetchTickets();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Local/Remote filtering
  const hasDbData = ticketsList.length > 0;
  const sourceList = hasDbData ? ticketsList : tickets;
  
  const filteredTickets = hasDbData 
    ? ticketsList 
    : sourceList.filter((ticket) => {
        const search = searchQuery.toLowerCase();
        return (
          ticket.title?.toLowerCase().includes(search) ||
          (ticket.description || ticket.message)?.toLowerCase().includes(search) ||
          (ticket.user?.fullName || ticket.user?.name)?.toLowerCase().includes(search) ||
          (ticket.user?.email || ticket.contact?.email)?.toLowerCase().includes(search)
        );
      });

  // Handle resolving support ticket (PATCH /help-support/:id/status)
  const handleResolveTicket = async (ticketId: string, reply: string): Promise<boolean> => {
    toast.loading("Resolving support ticket...", { id: "resolve-ticket" });
    try {
      const res = await myFetch(`/help-support/${ticketId}/status`, {
        method: "PATCH",
        body: {
          status: "resolved",
          reply,
        },
      });

      if (res.success) {
        toast.success("Support ticket resolved successfully!", { id: "resolve-ticket" });
        setSelectedTicket(null);
        fetchTickets();
        return true;
      } else {
        toast.error(res.message || "Failed to resolve ticket", { id: "resolve-ticket" });
        return false;
      }
    } catch (error) {
      console.error("Error resolving ticket:", error);
      toast.error("An unexpected error occurred while resolving ticket", { id: "resolve-ticket" });
      return false;
    }
  };

  // Handle deleting/removing support ticket (DELETE /help-support/:id)
  const handleDeleteTicket = async (ticketId: string): Promise<void> => {
    toast.loading("Removing support ticket...", { id: "delete-ticket" });
    try {
      const res = await myFetch(`/help-support/${ticketId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Support ticket removed successfully!", { id: "delete-ticket" });
        fetchTickets();
      } else {
        toast.error(res.message || "Failed to remove ticket", { id: "delete-ticket" });
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("An unexpected error occurred while removing ticket", { id: "delete-ticket" });
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto pb-20">
      {/* Page Header */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-100 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              Loading tickets...
            </div>
          ) : (
            <>
              <HelpSupportTable 
                tickets={filteredTickets} 
                onView={(ticket) => setSelectedTicket(ticket)} 
                onDelete={handleDeleteTicket}
              />

              {/* Dynamic Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4 py-4 border-t border-gray-100/50 animate-fadeIn">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {getPaginationRange().map((p, i) => {
                      if (p === "...") {
                        return (
                          <span
                            key={`ellipsis-${i}`}
                            className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#A7A7A7]"
                          >
                            ...
                          </span>
                        );
                      }

                      const pageNum = p as number;
                      const isActive = pageNum === page;

                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-[#fcd34d] hover:bg-[#fbbf24] text-white font-bold transform scale-105"
                              : "text-[#A7A7A7] hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-md"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <HelpSupportDetail 
          ticket={selectedTicket} 
          onBack={() => setSelectedTicket(null)} 
          onResolve={handleResolveTicket}
        />
      )}
    </div>
  );
}
