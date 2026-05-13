"use client";

import { Upload, X, LayoutTemplate } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function AddSponsorModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 border-gray-200">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Add New Sponsor
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Sponsor Name
            </label>
            <input
              type="text"
              placeholder="Enter sponsor name"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Sponsor Tier
            </label>
            <input
              type="text"
              placeholder="Enter sponsor tier"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sponsor Logo
            </label>
            
            {/* Requirements Box */}
            <div className="bg-[#f0f7ff] border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative flex flex-col items-center">
                <span className="text-[10px] text-blue-500 absolute -top-4">512px</span>
                <span className="text-[10px] text-blue-500 absolute -left-7 top-1/2 -translate-y-1/2 -rotate-90">512px</span>
                <div className="w-16 h-16 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-white mt-1 mb-1">
                  <LayoutTemplate className="w-8 h-8 text-blue-300" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-blue-500 absolute -bottom-4">1:1 Ratio</span>
              </div>
              
              <div className="flex flex-col gap-1 pl-4">
                <span className="font-semibold text-gray-700 text-sm">
                  Required Dimensions: 512 x 512 pixels
                </span>
                <span className="text-xs text-gray-500">
                  • Square format (1:1 aspect ratio)
                </span>
                <span className="text-xs text-gray-500">
                  • PNG or JPG format recommended
                </span>
                <span className="text-xs text-gray-500">
                  • Maximum file size: 2MB
                </span>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mt-2">
              <Upload className="h-6 w-6 text-gray-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload logo
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                PNG, JPG or SVG(max. 2MB)
              </p>
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900">
                Active Status
              </span>
              <span className="text-xs text-gray-500">
                Display this sponsor on the public website
              </span>
            </div>
            {/* Custom Toggle Switch */}
            <button
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-[#3b82f6]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors w-full sm:w-[120px]"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-md font-medium text-sm hover:bg-blue-600 transition-colors w-full sm:w-[120px]">
              Add Sponsor
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
