/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Shuffle, ChevronDown } from "lucide-react";
import { DriverRequestsTable } from "@/components/driver-requests/DriverRequestsTable";
import { AddDriverModal } from "@/components/driver-requests/AddDriverModal";
import { RunDrawModal } from "@/components/driver-requests/RunDrawModal";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { CustomPagination } from "@/components/ui/custom-pagination";

export default function DriverRequestsView() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Stats states
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);



  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await myFetch("/event?page=1&limit=10&fields=_id,name,class", { method: "GET" });
        if (res.success && res.data) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch registrations
  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "15");
      if (selectedEventId) params.append("event", selectedEventId);
      if (selectedClassName) params.append("class", selectedClassName);
      if (selectedStatus) params.append("status", selectedStatus);

      const res = await myFetch(`/event-registration?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.success && res.data) {
        setRegistrations(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPage || 1);
          setTotalItems(res.pagination.total || res.data.length);
        } else {
          setTotalPages(1);
          setTotalItems(res.data.length);
        }
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
      toast.error("Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats count across registrations (event-specific if selected)
  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "1000");
      if (selectedEventId) params.append("event", selectedEventId);
      if (selectedClassName) params.append("class", selectedClassName);

      const res = await myFetch(`/event-registration?${params.toString()}`, {
        method: "GET",
      });

      if (res.success && res.data) {
        const pending = res.data.filter((r: any) => r.status === "pending").length;
        const approved = res.data.filter((r: any) => r.status === "approved").length;
        setPendingCount(pending);
        setApprovedCount(approved);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [page, selectedEventId, selectedClassName, selectedStatus]);

  useEffect(() => {
    fetchStats();
  }, [registrations, selectedEventId, selectedClassName]);

  const handleAccept = async (id: string) => {
    toast.loading("Accepting request...", { id: "accept-request" });
    try {
      const res = await myFetch(`/event-registration/${id}/status`, {
        method: "PATCH",
        body: { status: "approved" },
      });

      if (res.success) {
        toast.success("Driver request approved!", { id: "accept-request" });
        fetchRegistrations();
      } else {
        toast.error(res.message || "Failed to accept request", { id: "accept-request" });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("An unexpected error occurred", { id: "accept-request" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this registration request?")) return;

    toast.loading("Removing request...", { id: "delete-request" });
    try {
      const res = await myFetch(`/event-registration/${id}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Registration request removed!", { id: "delete-request" });
        fetchRegistrations();
      } else {
        toast.error(res.message || "Failed to remove request", { id: "delete-request" });
      }
    } catch (error) {
      console.error("Error removing request:", error);
      toast.error("An unexpected error occurred", { id: "delete-request" });
    }
  };

  // Find classes of the selected event (supporting _id or id)
  const selectedEvent = events.find((e) => (e._id || e.id) === selectedEventId);
  const classesList = selectedEvent?.class || [];

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto relative pb-20 p-4 sm:p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Driver Registrations
        </h1>
        <p className="text-sm text-gray-500">
          Manage driver registration requests for events
        </p>
      </div>

      {/* Top Cards & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="bg-white border border-gray-100 rounded-xl p-4 w-full sm:min-w-[200px] flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Requests</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{pendingCount}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 w-full sm:min-w-[200px] flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Approved</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{approvedCount}</span>
          </div>
        </div>

        <AddDriverModal>
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm w-full sm:w-auto justify-center active:scale-[0.98]">
            Add Driver
          </button>
        </AddDriverModal>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Filter by Event */}
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Event
          </label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setSelectedClassName(""); // Reset class selection
                setPage(1);
              }}
              className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Events</option>
              {events.map((e) => {
                const eventId = e._id || e.id;
                return (
                  <option key={eventId} value={eventId}>
                    {e.name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter by Class */}
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Class
          </label>
          <div className="relative">
            <select
              value={selectedClassName}
              onChange={(e) => {
                setSelectedClassName(e.target.value);
                setPage(1);
              }}
              disabled={!selectedEventId}
              className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Classes</option>
              {classesList.map((c: any, idx: number) => {
                const key = c._id || c.id || c.name || idx;
                return (
                  <option key={key} value={c.name}>
                    {c.name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter by Status */}
        <div className="flex flex-col gap-1.5 w-full sm:w-[200px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Status
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading registrations...
        </div>
      ) : (
        <>
          <DriverRequestsTable
            data={registrations}
            onAccept={handleAccept}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <CustomPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Floating Run Draw Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 animate-fadeIn">
        <RunDrawModal
          eventId={selectedEventId}
          className={selectedClassName}
          onSuccess={fetchRegistrations}
        >
          <button
            disabled={!selectedEventId || !selectedClassName}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg text-white ${
              selectedEventId && selectedClassName
                ? "bg-[#3b82f6] hover:bg-blue-600 cursor-pointer active:scale-[0.97]"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
            title={
              selectedEventId && selectedClassName
                ? "Click to publish drawing pulling order"
                : "Please select a specific Event and Class in the filters to run draw"
            }
          >
            <Shuffle className="w-4 h-4" />
            Run Draw
          </button>
        </RunDrawModal>
      </div>
    </div>
  );
}
