/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ChevronDown, Trash2, Loader2, Trophy, AlertCircle, Car, Pencil } from "lucide-react";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";
import { useListQuery } from "@/hooks/useListQuery";
import AddResultModal from "./AddResultModal";
import EditResultModal from "./EditResultModal";

export default function ResultsView() {
  // Filtering and standings selection states
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");

  // Edit Modal form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);

  // Integrated list query management for rankings standings (top 100 entries)
  const {
    data: resultsList,
    isLoading: isTableLoading,
    refresh: fetchResults,
  } = useListQuery<any>({
    endpoint: "/result",
    initialParams: {
      limit: "100",
      event: selectedEventId,
      class: selectedClassName,
      sort: "-point",
    },
    // Only run the API request if required filters are selected
    skip: !selectedEventId || !selectedClassName,
  });

  const handleAddSuccess = (eventId: string, className: string, eventObj: any) => {
    // If the added result matches current filters, reload results
    if (eventId === selectedEventId && className === selectedClassName) {
      fetchResults();
    } else {
      // Auto swap filters to show the new result
      setSelectedEventId(eventId);
      setSelectedEvent(eventObj);
      setSelectedClassName(className);
    }
  };

  const openEditModal = (result: any) => {
    setEditingResult(result);
    setIsEditModalOpen(true);
  };

  // Delete result entry
  const handleDeleteResult = async (resultId: string) => {
    toast.loading("Deleting result entry...", { id: "result-action" });
    try {
      const res = await myFetch(`/result/${resultId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Result deleted successfully!", { id: "result-action" });
        fetchResults();
      } else {
        toast.error(res.message || "Failed to delete result entry", { id: "result-action" });
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      toast.error("An error occurred while deleting result", { id: "result-action" });
    }
  };

  // Available classes derived dynamically from selected events
  const filterAvailableClasses = selectedEvent?.class || [];

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Display, manage, and dispatch official pull result rankings for competitors.
          </p>
        </div>

        <AddResultModal onSuccess={handleAddSuccess} />
      </div>

      {/* Dynamic Filters Section */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Championship Event
          </label>
          <SearchableInfiniteSelect
            endpoint="/event"
            fields="_id,name,class"
            placeholder="Choose an Event"
            value={selectedEventId}
            onChange={(value, event) => {
              setSelectedEventId(value);
              setSelectedEvent(event);
              setSelectedClassName(""); // Reset class when event changes
            }}
            displayValue={(evt) => evt.name}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Competitor Class
          </label>
          <div className="relative">
            <select
              value={selectedClassName}
              disabled={!selectedEventId}
              onChange={(e) => setSelectedClassName(e.target.value)}
              className="flex h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer transition-all hover:bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <option value="">
                {!selectedEventId ? "Select event first" : "Choose a Class"}
              </option>
              {filterAvailableClasses.map((cls: any) => (
                <option key={cls.name || cls} value={cls.name || cls}>
                  {cls.name || cls}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Dynamic Results Presentation Section */}
      <div className="w-full">
        {isTableLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            Compiling and ranking pull results...
          </div>
        ) : !selectedEventId || !selectedClassName ? (
          /* Simple, Transparent Light Empty State (No card box) */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50/80 flex items-center justify-center mb-4 text-blue-500">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Awaiting Selector Filter
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Select a championship event and competitor class from the dropdown selectors above to retrieve official pull standings.
            </p>
          </div>
        ) : resultsList.length === 0 ? (
          /* Filtered but empty state */
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4 text-yellow-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No pull results found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              There are no official result entries recorded for this category yet. Click &quot;Add New Result&quot; to record the first standings.
            </p>
          </div>
        ) : (
          /* Results Table Display */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-150 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Official Rankings Standings
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                {resultsList.length} Entries
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-bold text-gray-400 bg-gray-50/30 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-center">Rank</th>
                    <th className="px-6 py-4">Driver Name</th>
                    <th className="px-6 py-4">Tractor</th>
                    <th className="px-6 py-4">Distance (ft)</th>
                    <th className="px-6 py-4">Points</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resultsList.map((row, index) => {
                    const pos = index + 1;
                    const isPodium = pos <= 3;
                    const podiumBg = pos === 1 
                      ? "bg-yellow-500/10 text-yellow-700 font-bold border border-yellow-200/50" 
                      : pos === 2 
                      ? "bg-slate-400/10 text-slate-700 font-bold border border-slate-200/50" 
                      : "bg-amber-600/10 text-amber-800 font-bold border border-amber-200/50";

                    return (
                      <tr 
                        key={row._id || row.id} 
                        className="bg-white hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-center">
                          {isPodium ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${podiumBg}`}>
                              {pos}
                            </span>
                          ) : (
                            <span className="text-gray-500 font-semibold">{pos}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {row.driver?.fullName || "Deleted competitor"}
                        </td>
                        <td className="px-6 py-4">
                          {row.registration?.tractor ? (
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Car className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-xs sm:text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                                {row.registration.tractor}
                              </span>
                            </div>
                          ) : row.driver?.tractorName && row.driver.tractorName.length > 0 ? (
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Car className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-xs sm:text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                                {row.driver.tractorName.join(", ")}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-blue-600 text-base">
                          {row.distance.toFixed(2)} ft
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {row.point ?? 0} pts
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(row)}
                            title="Edit Result"
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all active:scale-95"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <DeleteModal
                            itemId={row._id || row.id}
                            triggerBtn={
                              <button
                                title="Delete Result"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all active:scale-95"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            }
                            title="Delete Pull Result"
                            description="Are you absolutely sure you want to delete this result entry? This action cannot be undone."
                            actionBtnText="Delete"
                            action={handleDeleteResult}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Refactored Modular Edit Result Modal */}
      <EditResultModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        result={editingResult}
        onSuccess={fetchResults}
      />
    </div>
  );
}
