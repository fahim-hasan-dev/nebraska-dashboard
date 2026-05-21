/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Upload, Trash2, Pencil } from "lucide-react";
import { AddSponsorModal } from "@/components/sponsors/AddSponsorModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { useState, useEffect } from "react";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";
import toast from "react-hot-toast";

// Reusable toggle component
function CustomToggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-[22px] w-[38px] items-center rounded-full transition-colors ${
        isOn ? "bg-[#3b82f6]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          isOn ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function SponsorsView({ initialSponsors }: { initialSponsors: any }) {
  const getCategorizedSponsors = (data: any) => {
    if (!data) return { platinum: [], gold: [], silver: [] };
    if (Array.isArray(data)) {
      return {
        platinum: data.filter((s: any) => s.type === "platinum"),
        gold: data.filter((s: any) => s.type === "gold"),
        silver: data.filter((s: any) => s.type === "silver"),
      };
    }
    return {
      platinum: data.platinum || [],
      gold: data.gold || [],
      silver: data.silver || [],
    };
  };

  const [sponsors, setSponsors] = useState(() => getCategorizedSponsors(initialSponsors));

  const fetchSponsors = async () => {
    try {
      const res = await myFetch("/sponsor?limit=100", { method: "GET", cache: "no-store" });
      if (res.success && Array.isArray(res.data)) {
        setSponsors(getCategorizedSponsors(res.data));
      }
    } catch (err) {
      console.error("Error fetching sponsors:", err);
    }
  };

  useEffect(() => {
    if (initialSponsors) {
      setSponsors(getCategorizedSponsors(initialSponsors));
    }
  }, [initialSponsors]);

  const handleToggleActive = async (sponsor: any) => {
    const updatedStatus = !sponsor.isActive;
    toast.loading("Updating status...", { id: "toggle-sponsor" });
    try {
      const res = await myFetch(`/sponsor/${sponsor._id}`, {
        method: "PATCH",
        body: { isActive: updatedStatus },
      });
      if (res.success) {
        toast.success("Sponsor status updated successfully", { id: "toggle-sponsor" });
        fetchSponsors();
      } else {
        toast.error(res.message || "Failed to update status", { id: "toggle-sponsor" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status", { id: "toggle-sponsor" });
    }
  };

  const handleDeleteSponsor = async (sponsorId: string) => {
    toast.loading("Deleting sponsor...", { id: "delete-sponsor" });
    try {
      const res = await myFetch(`/sponsor/${sponsorId}`, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("Sponsor deleted successfully", { id: "delete-sponsor" });
        fetchSponsors();
      } else {
        toast.error(res.message || "Failed to delete sponsor", { id: "delete-sponsor" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete sponsor", { id: "delete-sponsor" });
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-xl font-bold text-gray-900">Sponsor Management</h1>
        <AddSponsorModal onSuccess={fetchSponsors}>
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm w-full sm:w-auto justify-center">
            <Upload className="w-4 h-4" />
            Upload Sponsor
          </button>
        </AddSponsorModal>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-10">
        {/* Platinum */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="font-bold text-gray-900">Platinum Sponsors</h2>
            <span className="text-xs text-gray-400 font-semibold">({sponsors.platinum?.length || 0})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.platinum?.map((sponsor: any) => (
              <div
                key={sponsor._id}
                className="bg-[#f0f7ff] border border-blue-200 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden">
                  {sponsor.image ? (
                    <img
                      src={getImageUrl(sponsor.image)}
                      alt={sponsor.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-gray-300 text-xs">No Logo</span>
                  )}
                </div>
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-blue-500 font-semibold uppercase">
                      Platinum
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.isActive}
                      onToggle={() => handleToggleActive(sponsor)}
                    />
                    <AddSponsorModal sponsor={sponsor} onSuccess={fetchSponsors}>
                      <button className="text-blue-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </AddSponsorModal>
                    <DeleteModal
                      itemId={sponsor._id}
                      triggerBtn={
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                      title="Delete Sponsor"
                      description={`Are you sure you want to permanently delete sponsor "${sponsor.name}"?`}
                      actionBtnText="Delete"
                      action={handleDeleteSponsor}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="font-bold text-gray-900">Gold Sponsors</h2>
            <span className="text-xs text-gray-400 font-semibold">({sponsors.gold?.length || 0})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.gold?.map((sponsor: any) => (
              <div
                key={sponsor._id}
                className="bg-[#fffdf5] border border-amber-200/60 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-amber-100 flex items-center justify-center overflow-hidden">
                  {sponsor.image ? (
                    <img
                      src={getImageUrl(sponsor.image)}
                      alt={sponsor.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-gray-300 text-xs">No Logo</span>
                  )}
                </div>
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-amber-500 font-semibold uppercase">
                      Gold
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.isActive}
                      onToggle={() => handleToggleActive(sponsor)}
                    />
                    <AddSponsorModal sponsor={sponsor} onSuccess={fetchSponsors}>
                      <button className="text-blue-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </AddSponsorModal>
                    <DeleteModal
                      itemId={sponsor._id}
                      triggerBtn={
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                      title="Delete Sponsor"
                      description={`Are you sure you want to permanently delete sponsor "${sponsor.name}"?`}
                      actionBtnText="Delete"
                      action={handleDeleteSponsor}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Silver */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <h2 className="font-bold text-gray-900">Silver Sponsors</h2>
            <span className="text-xs text-gray-400 font-semibold">({sponsors.silver?.length || 0})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.silver?.map((sponsor: any) => (
              <div
                key={sponsor._id}
                className="bg-[#fafafa] border border-dashed border-gray-300 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                  {sponsor.image ? (
                    <img
                      src={getImageUrl(sponsor.image)}
                      alt={sponsor.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-gray-300 text-xs">No Logo</span>
                  )}
                </div>
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-gray-500 font-semibold uppercase">
                      Silver
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.isActive}
                      onToggle={() => handleToggleActive(sponsor)}
                    />
                    <AddSponsorModal sponsor={sponsor} onSuccess={fetchSponsors}>
                      <button className="text-blue-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </AddSponsorModal>
                    <DeleteModal
                      itemId={sponsor._id}
                      triggerBtn={
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                      title="Delete Sponsor"
                      description={`Are you sure you want to permanently delete sponsor "${sponsor.name}"?`}
                      actionBtnText="Delete"
                      action={handleDeleteSponsor}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visibility Summary */}
      <div className="mt-12 bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-6 text-sm">
          Visibility Summary
        </h3>
        <div className="flex flex-wrap items-center gap-4 sm:gap-16 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-gray-500">Platinum:</span>
            <span className="text-gray-900">
              {sponsors.platinum?.filter((s: any) => s.isActive).length}/{sponsors.platinum?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-500">Gold:</span>
            <span className="text-gray-900">
              {sponsors.gold?.filter((s: any) => s.isActive).length}/{sponsors.gold?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-500">Silver:</span>
            <span className="text-gray-900">
              {sponsors.silver?.filter((s: any) => s.isActive).length}/{sponsors.silver?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

