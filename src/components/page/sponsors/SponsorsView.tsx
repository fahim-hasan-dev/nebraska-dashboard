/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Upload, Trash2 } from "lucide-react";
import { AddSponsorModal } from "@/components/sponsors/AddSponsorModal";
import { useState } from "react";

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
  const [sponsors, setSponsors] = useState(initialSponsors || {
    platinum: [],
    gold: [],
    silver: [],
  });

  const toggleSponsor = (tier: "platinum" | "gold" | "silver", id: number) => {
    setSponsors((prev: any) => ({
      ...prev,
      [tier]: prev[tier].map((s: any) => (s.id === id ? { ...s, active: !s.active } : s)),
    }));
  };

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-xl font-bold text-gray-900">Sponsor Management</h1>
        <AddSponsorModal>
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
            <span className="text-xs text-gray-400 font-medium">(1)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.platinum?.map((sponsor: any) => (
              <div
                key={sponsor.id}
                className="bg-[#f0f7ff] border border-blue-200 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-blue-100" />
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-blue-500 font-medium">
                      Platinum
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.active}
                      onToggle={() => toggleSponsor("platinum", sponsor.id)}
                    />
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <span className="text-xs text-gray-400 font-medium">(2)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.gold?.map((sponsor: any) => (
              <div
                key={sponsor.id}
                className="bg-[#fffdf5] border border-amber-200/60 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-amber-100" />
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-amber-500 font-medium">
                      Gold
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.active}
                      onToggle={() => toggleSponsor("gold", sponsor.id)}
                    />
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <span className="text-xs text-gray-400 font-medium">(1)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.silver?.map((sponsor: any) => (
              <div
                key={sponsor.id}
                className="bg-[#fafafa] border border-dashed border-gray-300 rounded-xl p-3 flex flex-col gap-3"
              >
                <div className="w-full h-36 bg-white rounded-lg border border-gray-200" />
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-900 leading-tight">
                      {sponsor.name}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Silver
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CustomToggle
                      isOn={sponsor.active}
                      onToggle={() => toggleSponsor("silver", sponsor.id)}
                    />
                    <button className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <span className="text-gray-900">1/1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-500">Gold:</span>
            <span className="text-gray-900">2/2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="text-gray-500">Silver:</span>
            <span className="text-gray-900">0/1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-600" />
            <span className="text-gray-500">Bronze:</span>
            <span className="text-gray-900">0/0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
