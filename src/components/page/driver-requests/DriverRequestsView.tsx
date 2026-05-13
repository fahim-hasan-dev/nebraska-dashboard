"use client";

import { Clock, CheckCircle2, Shuffle, ChevronDown } from "lucide-react";
import { DriverRequestsTable } from "@/components/driver-requests/DriverRequestsTable";
import { AddDriverModal } from "@/components/driver-requests/AddDriverModal";
import { RunDrawModal } from "@/components/driver-requests/RunDrawModal";

export default function DriverRequestsView({ requests }: { requests: any[] }) {
  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto relative pb-20">
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
          <div className="bg-white border border-gray-100 rounded-xl p-4 w-full sm:min-w-[200px] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Pending Requests</span>
            </div>
            <span className="text-xl font-bold text-gray-900">2</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 w-full sm:min-w-[200px] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Approved</span>
            </div>
            <span className="text-xl font-bold text-gray-900">1</span>
          </div>
        </div>

        <AddDriverModal>
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors shadow-sm w-full sm:w-auto justify-center">
            Add Driver
          </button>
        </AddDriverModal>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Event
          </label>
          <div className="relative">
            <select className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
              <option>All Events</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Class
          </label>
          <div className="relative">
            <select className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
              <option>All class</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-full sm:w-[250px]">
          <label className="text-xs font-semibold text-gray-500">
            Filter by Status
          </label>
          <div className="relative">
            <select className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
              <option>Approved</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <DriverRequestsTable data={requests} />

      {/* Floating Run Draw Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40">
        <RunDrawModal>
          <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors shadow-lg">
            <Shuffle className="w-4 h-4" />
            Run Draw
          </button>
        </RunDrawModal>
      </div>
    </div>
  );
}
