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
  const [sponsors, setSponsors] = useState<any[]>(() => {
    return Array.isArray(initialSponsors) ? initialSponsors : [];
  });

  const fetchSponsors = async () => {
    try {
      const res = await myFetch("/sponsor?limit=100", { method: "GET", cache: "no-store" });
      if (res.success && Array.isArray(res.data)) {
        setSponsors(res.data);
      }
    } catch (err) {
      console.error("Error fetching sponsors:", err);
    }
  };

  useEffect(() => {
    if (initialSponsors) {
      setSponsors(Array.isArray(initialSponsors) ? initialSponsors : []);
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
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm w-full sm:w-auto justify-center cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Sponsor
          </button>
        </AddSponsorModal>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-10">
        {sponsors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm text-center p-6">
            <Upload className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">No Sponsors Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Upload your first sponsor logo to display them on the website.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor: any) => (
              <div
                key={sponsor._id}
                className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all animate-fadeIn"
              >
                <div className="w-full h-36 bg-gray-50/50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
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
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-gray-900 leading-tight truncate">
                      {sponsor.name}
                    </span>
                    <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 font-bold uppercase mt-1 w-fit">
                      {sponsor.category || "Sponsor"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.isActive}
                      onToggle={() => handleToggleActive(sponsor)}
                    />
                    <AddSponsorModal sponsor={sponsor} onSuccess={fetchSponsors}>
                      <button className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </AddSponsorModal>
                    <DeleteModal
                      itemId={sponsor._id}
                      triggerBtn={
                        <button className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
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
        )}
      </div>
    </div>
  );
}

