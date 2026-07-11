/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Clock, CheckCircle2, ChevronDown, Loader2, Shuffle } from "lucide-react";
import { DriverRequestsTable } from "@/components/driver-requests/DriverRequestsTable";
import { AddDriverModal } from "@/components/driver-requests/AddDriverModal";
import { RunDrawModal } from "@/components/driver-requests/RunDrawModal";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useListQuery } from "@/hooks/useListQuery";
export default function DriverRequestsView() {
  // Filter category states
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Statistics counters
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  // Integrated list query management
  const {
    data: registrations,
    isLoading,
    page,
    setPage,
    totalPages,
    refresh: fetchRegistrations,
  } = useListQuery<any>({
    endpoint: "/event-registration",
    initialParams: {
      limit: "10",
      event: selectedEventId,
      class: selectedClassName,
      status: selectedStatus,
    },
    // Prevent fetching if required Event and Class filters are not selected yet
    skip: !selectedEventId || !selectedClassName,
  });

  // Fetch stats count across registrations (event-specific if selected)
  const fetchStats = async () => {
    if (!selectedEventId || !selectedClassName) {
      setPendingCount(0);
      setApprovedCount(0);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("limit", "1000");
      params.append("event", selectedEventId);
      params.append("class", selectedClassName);

      const res = await myFetch(`/event-registration?${params.toString()}`, {
        method: "GET",
      });

      if (res.success && res.data) {
        const list = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);
        const pending = list.filter((r: any) => r.status === "pending").length;
        const approved = list.filter((r: any) => r.status === "approved").length;
        setPendingCount(pending);
        setApprovedCount(approved);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

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

  // Find classes of the selected event
  const classesList = selectedEvent?.class || [];
  const hasExistingDraw = registrations.some((reg) => !!reg.drawPosition);

  return (
    <div className="flex flex-col w-full min-h-full max-w-[1400px] mx-auto relative p-4 sm:p-6 md:p-8 pb-32 md:pb-40">
      {/* Page Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Driver Registrations
          </h1>
          <p className="text-sm text-gray-500">
            Manage driver registration requests for events
          </p>
        </div>
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

        <AddDriverModal onSuccess={() => { fetchRegistrations(); fetchStats(); }}>
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm w-full sm:w-auto justify-center active:scale-[0.98]">
            Add Driver
          </button>
        </AddDriverModal>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        {/* Filter by Event */}
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Event
          </label>
          <SearchableInfiniteSelect
            endpoint="/event"
            fields="_id,name,class"
            placeholder="All Events"
            value={selectedEventId}
            onChange={(value, event) => {
              setSelectedEventId(value);
              setSelectedEvent(event);
              setSelectedClassName(""); // Reset class selection
              setPage(1);
            }}
            displayValue={(evt) => evt.name}
          />
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
              className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
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
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
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
              disabled={!selectedClassName}
              className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table / Instructions */}
      {!selectedEventId || !selectedClassName ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm text-center px-4">
          <Clock className="w-12 h-12 text-blue-500/80 mb-4 animate-pulse" />
          <h3 className="text-gray-900 font-bold text-base">Select Event & Class</h3>
          <p className="text-sm text-gray-500 max-w-md mt-1">
            Please select both a championship event and a puller class from the filters above to view and manage driver registration requests.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
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
            disabled={
              !selectedEventId || 
              !selectedClassName || 
              selectedStatus !== "approved" || 
              registrations.length < 2
            }
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg text-white ${
              selectedEventId && selectedClassName && selectedStatus === "approved" && registrations.length >= 2
                ? "bg-[#3b82f6] hover:bg-blue-600 cursor-pointer active:scale-[0.97]"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
            title={
              !selectedEventId
                ? "Please select a championship event to run draw"
                : !selectedClassName
                ? "Please select a puller class to run draw"
                : selectedStatus !== "approved"
                ? "Status filter must be set to 'Approved' to run draw"
                : registrations.length < 2
                ? "At least 2 approved registrations are required to run draw"
                : "Click to publish drawing pulling order"
            }
          >
            <Shuffle className="w-4 h-4" />
            {hasExistingDraw ? "Redraw" : "Run Draw"}
          </button>
        </RunDrawModal>
      </div>
    </div>
  );
}
