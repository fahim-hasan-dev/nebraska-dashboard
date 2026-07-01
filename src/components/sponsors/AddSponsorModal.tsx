"use client";

import { Upload, LayoutTemplate } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageUrl";

interface AddSponsorModalProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sponsor?: any;
  onSuccess?: () => void;
}

export function AddSponsorModal({ children, sponsor, onSuccess }: AddSponsorModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when the modal opens or sponsor changes
  useEffect(() => {
    if (open) {
      setName(sponsor?.name || "");
      setIsActive(sponsor ? sponsor.isActive : true);
      setSelectedFile(null);
      setPreviewUrl(sponsor?.image || null);
    }
  }, [open, sponsor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB.");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Sponsor name is required");
      return;
    }
    if (!sponsor && !selectedFile) {
      toast.error("Sponsor logo is required");
      return;
    }

    setIsLoading(true);
    const toastId = sponsor ? "update-sponsor" : "create-sponsor";
    toast.loading(sponsor ? "Updating sponsor..." : "Uploading sponsor...", { id: toastId });

    try {
      const formData = new FormData();
      const dataPayload = {
        name: name.trim(),
        isActive,
      };

      formData.append("data", JSON.stringify(dataPayload));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const url = sponsor ? `/sponsor/${sponsor._id}` : "/sponsor/create";
      const method = sponsor ? "PATCH" : "POST";

      const response = await myFetch(url, {
        method,
        body: formData,
      });

      if (response.success) {
        toast.success(
          sponsor ? "Sponsor updated successfully!" : "Sponsor uploaded successfully!",
          { id: toastId }
        );
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || "Failed to save sponsor", { id: toastId });
      }
    } catch (error) {
      console.error("Error saving sponsor:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 gap-0 border-gray-200">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {sponsor ? "Edit Sponsor" : "Add New Sponsor"}
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none animate-fadeIn" />
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col gap-5">
          {/* Sponsor Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Sponsor Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sponsor name"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>


          {/* Logo Upload Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sponsor Logo *
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

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Dropzone / Image Preview */}
            <div
              onClick={() => !isLoading && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mt-2 min-h-[140px] relative overflow-hidden group ${
                isLoading ? "pointer-events-none opacity-55" : ""
              }`}
            >
              {previewUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <div className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={getImageUrl(previewUrl)}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-600">
                    Click or drag to change logo
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                  <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG, JPG or SVG (max. 2MB)
                  </p>
                </>
              )}
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
              onClick={() => !isLoading && setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-[#3b82f6]" : "bg-gray-300"
              } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={isLoading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center shadow-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-10 px-6 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors w-full sm:w-auto flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : sponsor ? "Save" : "Add Sponsor"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

