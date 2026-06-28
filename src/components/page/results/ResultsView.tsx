/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, Trash2, Loader2, Trophy, AlertCircle, Car, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";

interface ResultsViewProps {
  initialEvents: any[];
  initialDrivers: any[];
}

export default function ResultsView({}: ResultsViewProps) {
  // Filtering states
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [resultsList, setResultsList] = useState<any[]>([]);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

  // Modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalEventId, setModalEventId] = useState<string>("");
  const [modalSelectedEvent, setModalSelectedEvent] = useState<any>(null);
  const [modalClassName, setModalClassName] = useState<string>("");
  const [modalDriverId, setModalDriverId] = useState<string>("");
  const [modalDistance, setModalDistance] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string>("");
  const [editEventId, setEditEventId] = useState<string>("");
  const [editSelectedEvent, setEditSelectedEvent] = useState<any>(null);
  const [editClassName, setEditClassName] = useState<string>("");
  const [editDriverId, setEditDriverId] = useState<string>("");
  const [editDriverName, setEditDriverName] = useState<string>("");
  const [editDistance, setEditDistance] = useState<string>("");
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);

  // Fetch results when Event and Class filters are chosen
  const fetchResults = async (eventId: string, className: string) => {
    if (!eventId || !className) return;
    setIsTableLoading(true);
    try {
      const res = await myFetch(`/result?event=${eventId}&class=${className}&limit=100`, {
        method: "GET",
        cache: "no-store",
      });
      if (res.success && res.data) {
        // Sort results by distance descending so greatest distance is 1st place
        const rawResults = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const sorted = [...rawResults].sort((a, b) => Number(b.distance) - Number(a.distance));
        setResultsList(sorted);
      } else {
        setResultsList([]);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load pull results");
    } finally {
      setIsTableLoading(false);
    }
  };

  // Trigger results fetch on change of Event & Class
  useEffect(() => {
    if (selectedEventId && selectedClassName) {
      fetchResults(selectedEventId, selectedClassName);
    } else {
      setResultsList([]);
    }
  }, [selectedEventId, selectedClassName]);

  // Add new result submission handler
  const handleAddResult = async () => {
    if (!modalEventId) {
      toast.error("Please select an event");
      return;
    }
    if (!modalClassName) {
      toast.error("Please select a class");
      return;
    }
    if (!modalDriverId) {
      toast.error("Please select a driver");
      return;
    }
    if (!modalDistance || isNaN(Number(modalDistance)) || Number(modalDistance) <= 0) {
      toast.error("Please enter a valid positive distance");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Recording result...", { id: "result-action" });

    try {
      const res = await myFetch("/result/create", {
        method: "POST",
        body: {
          event: modalEventId,
          class: modalClassName,
          driver: modalDriverId,
          distance: Number(modalDistance),
        },
      });

      if (res.success) {
        toast.success("Result recorded successfully!", { id: "result-action" });
        
        // Reset form fields
        setModalEventId("");
        setModalSelectedEvent(null);
        setModalClassName("");
        setModalDriverId("");
        setModalDistance("");
        setIsAddModalOpen(false);

        // If newly added result matches current filters, reload results
        if (modalEventId === selectedEventId && modalClassName === selectedClassName) {
          fetchResults(selectedEventId, selectedClassName);
        } else {
          // Auto swap filters to show the new result
          setSelectedEventId(modalEventId);
          setSelectedEvent(modalSelectedEvent);
          setSelectedClassName(modalClassName);
        }
      } else {
        toast.error(res.message || "Failed to record result", { id: "result-action" });
      }
    } catch (error) {
      console.error("Error creating result:", error);
      toast.error("An error occurred while recording result", { id: "result-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (result: any) => {
    setEditingResultId(result._id || result.id);
    setEditEventId(result.event?._id || result.event?.id || result.event || "");
    setEditSelectedEvent(result.event);
    setEditClassName(result.class || "");
    setEditDriverId(result.driver?._id || result.driver?.id || result.driver || "");
    setEditDriverName(
      result.driver?.fullName 
        ? `${result.driver.fullName}${result.driver.vehicleName ? ` (${result.driver.vehicleName})` : ""}` 
        : "Unknown Driver"
    );
    setEditDistance(String(result.distance || ""));
    setIsEditModalOpen(true);
  };

  const handleUpdateResult = async () => {
    if (!editEventId) {
      toast.error("Please select an event");
      return;
    }
    if (!editClassName) {
      toast.error("Please select a class");
      return;
    }
    if (!editDriverId) {
      toast.error("Please select a driver");
      return;
    }
    if (!editDistance || isNaN(Number(editDistance)) || Number(editDistance) <= 0) {
      toast.error("Please enter a valid positive distance");
      return;
    }

    setIsEditingSubmitting(true);
    toast.loading("Updating result...", { id: "result-action" });

    try {
      const res = await myFetch(`/result/${editingResultId}`, {
        method: "PATCH",
        body: {
          event: editEventId,
          class: editClassName,
          driver: editDriverId,
          distance: Number(editDistance),
        },
      });

      if (res.success) {
        toast.success("Result updated successfully!", { id: "result-action" });
        setIsEditModalOpen(false);
        if (selectedEventId && selectedClassName) {
          fetchResults(selectedEventId, selectedClassName);
        }
      } else {
        toast.error(res.message || "Failed to update result", { id: "result-action" });
      }
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("An error occurred while updating result", { id: "result-action" });
    } finally {
      setIsEditingSubmitting(false);
    }
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
        if (selectedEventId && selectedClassName) {
          fetchResults(selectedEventId, selectedClassName);
        }
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
  const modalAvailableClasses = modalSelectedEvent?.class || [];

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

        {/* Dynamic Modal Add Trigger */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto active:scale-[0.98]">
              <Plus className="w-4 h-4" />
              Add New Result
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="p-8 w-full max-w-full">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
                  Add Competitor Result
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Reusable Searchable Infinite Select for Modal Event */}
                <div className="space-y-1.5">
                  <Label htmlFor="modalEvent" className="text-gray-600 font-medium">Event</Label>
                  <SearchableInfiniteSelect
                    endpoint="/event"
                    fields="_id,name,class"
                    placeholder="Select Event"
                    value={modalEventId}
                    onChange={(value, event) => {
                      setModalEventId(value);
                      setModalSelectedEvent(event);
                      setModalClassName(""); // Reset class when event changes
                      setModalDriverId(""); // Reset driver when event changes
                    }}
                    displayValue={(evt) => evt.name}
                  />
                </div>

                {/* Class Selector in Modal (Dependent on Selected Event) */}
                <div className="space-y-1.5">
                  <Label htmlFor="modalClass" className="text-gray-600 font-medium">Competitor Class</Label>
                  <div className="relative">
                    <select
                      id="modalClass"
                      value={modalClassName}
                      disabled={!modalEventId}
                      onChange={(e) => {
                        setModalClassName(e.target.value);
                        setModalDriverId(""); // Reset driver when class changes
                      }}
                      className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!modalEventId ? "Please select event first" : "Select Class"}
                      </option>
                      {modalAvailableClasses.map((cls: any) => (
                        <option key={cls.name || cls} value={cls.name || cls}>
                          {cls.name || cls}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Reusable Searchable Infinite Select for Modal Driver */}
                <div className="space-y-1.5">
                  <Label htmlFor="modalDriver" className="text-gray-600 font-medium">Driver</Label>
                  <SearchableInfiniteSelect
                    endpoint={modalEventId && modalClassName ? "/event-registration" : "/user"}
                    fields="_id,email,fullName,vehicleName,phone"
                    extraParams={
                      modalEventId && modalClassName
                        ? { event: modalEventId, class: modalClassName, status: "approved" }
                        : { role: "driver" }
                    }
                    transformData={
                      modalEventId && modalClassName
                        ? (registrations) =>
                            registrations
                              .filter((reg: any) => reg.driver)
                              .map((reg: any) => ({
                                ...reg.driver,
                                _id: reg.driver._id,
                              }))
                        : undefined
                    }
                    placeholder={
                      !modalEventId || !modalClassName
                        ? "Please select Event & Class first"
                        : "Select Driver"
                    }
                    disabled={!modalEventId || !modalClassName}
                    value={modalDriverId}
                    onChange={(value) => setModalDriverId(value)}
                    displayValue={(driver) =>
                      `${driver.fullName}${driver.vehicleName ? ` (${driver.vehicleName})` : ""}`
                    }
                  />
                </div>

                {/* Distance in Modal */}
                <div className="space-y-1.5">
                  <Label htmlFor="modalDistance" className="text-gray-600 font-medium">Distance (ft)</Label>
                  <Input
                    id="modalDistance"
                    type="number"
                    step="0.01"
                    value={modalDistance}
                    onChange={(e) => setModalDistance(e.target.value)}
                    placeholder="e.g., 250.50"
                    className="h-12 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                  />
                </div>

                <Button
                  onClick={handleAddResult}
                  disabled={isSubmitting}
                  className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.99]"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Record Result
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              There are no official result entries recorded for this category yet. Click "Add New Result" to record the first standings.
            </p>
          </div>
        ) : (
          /* Results Table Display */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="px-6 py-4.5 bg-gray-50/50 border-b border-gray-150 flex items-center justify-between">
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
                    <th className="px-6 py-4">Vehicle/Tractor Name</th>
                    <th className="px-6 py-4">Distance (ft)</th>
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
                          {row.driver?.vehicleName ? (
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Car className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-xs sm:text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                                {row.driver.vehicleName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-blue-600 text-base">
                          {row.distance.toFixed(2)} ft
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

      {/* Edit Result Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="p-8 w-full max-w-full">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
                Update Competitor Result
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Event Select */}
              <div className="space-y-1.5">
                <Label htmlFor="editEvent" className="text-gray-600 font-medium">Event</Label>
                <SearchableInfiniteSelect
                  endpoint="/event"
                  fields="_id,name,class"
                  placeholder="Select Event"
                  value={editEventId}
                  onChange={(value, event) => {
                    setEditEventId(value);
                    setEditSelectedEvent(event);
                    setEditClassName(""); 
                    setEditDriverId("");
                  }}
                  displayValue={(evt) => evt.name}
                />
              </div>

              {/* Class Selector */}
              <div className="space-y-1.5">
                <Label htmlFor="editClass" className="text-gray-600 font-medium">Competitor Class</Label>
                <div className="relative">
                  <select
                    id="editClass"
                    value={editClassName}
                    disabled={!editEventId}
                    onChange={(e) => {
                      setEditClassName(e.target.value);
                      setEditDriverId("");
                    }}
                    className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!editEventId ? "Please select event first" : "Select Class"}
                    </option>
                    {(editSelectedEvent?.class || []).map((cls: any) => (
                      <option key={cls.name || cls} value={cls.name || cls}>
                        {cls.name || cls}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Driver Select */}
              <div className="space-y-1.5">
                <Label htmlFor="editDriver" className="text-gray-600 font-medium">Driver</Label>
                <Input
                  id="editDriver"
                  type="text"
                  value={editDriverName}
                  disabled={true}
                  className="h-12 border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed font-semibold"
                />
              </div>

              {/* Distance */}
              <div className="space-y-1.5">
                <Label htmlFor="editDistance" className="text-gray-600 font-medium">Distance (ft)</Label>
                <Input
                  id="editDistance"
                  type="number"
                  step="0.01"
                  value={editDistance}
                  onChange={(e) => setEditDistance(e.target.value)}
                  placeholder="e.g., 250.50"
                  className="h-12 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                />
              </div>

              <Button
                onClick={handleUpdateResult}
                disabled={isEditingSubmitting}
                className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.99]"
              >
                {isEditingSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Result
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
