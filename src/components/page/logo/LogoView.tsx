"use client";

import { Upload, ImageIcon, Trash2, Eye, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/imageUrl";

export default function LogoView() {
  const [currentFileUrl, setCurrentFileUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the current logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      setIsLoading(true);
      try {
        const res = await myFetch("/public/logo", {
          method: "GET",
          cache: "no-store",
        });
        if (res.success && res.data) {
          setCurrentFileUrl(res.data.content || "");
        }
      } catch (err) {
        console.error("Error fetching logo:", err);
        toast.error("Failed to fetch current logo information");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files (.png, .jpg, .jpeg)");
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
        toast.error("Please upload only image files (.png, .jpg, .jpeg)");
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

  const handleRemoveSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateLogo = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }

    setIsUpdating(true);
    toast.loading("Uploading and updating website logo...", { id: "upload-logo" });

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await myFetch("/public/logo", {
        method: "POST",
        body: formData,
      });

      if (res.success && res.data) {
        toast.success("Website logo updated successfully!", { id: "upload-logo" });
        setCurrentFileUrl(res.data.content || "");
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(res.message || "Failed to update website logo", { id: "upload-logo" });
      }
    } catch (err) {
      console.error("Error updating logo:", err);
      toast.error("An unexpected error occurred during upload", { id: "upload-logo" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 pb-32 md:pb-40">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Website Logo Management
        </h1>
        <p className="text-sm text-gray-500">
          Upload and manage the primary brand logo displayed on the website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Upload New Logo
            </span>
            <p className="text-xs text-gray-400">
              We recommend using a square or high-resolution landscape format logo (PNG, JPG, or SVG up to 2MB).
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/20 cursor-pointer hover:bg-gray-50/50 transition-all group"
          >
            <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-4 transition-colors" />
            <span className="text-sm font-bold text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
              Click or drag image file to upload
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG, JPEG or SVG (max. 2MB)
            </span>
          </div>

          {/* Selected File & Preview Card */}
          {selectedFile && previewUrl && (
            <div className="flex items-center justify-between border border-blue-100 bg-blue-50/10 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemoveSelectedFile}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                title="Remove selected file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6 mt-2">
            <button
              onClick={handleUpdateLogo}
              disabled={isLoading || isUpdating || !selectedFile}
              className="bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm disabled:cursor-not-allowed"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Logo
            </button>
          </div>
        </div>

        {/* Right Column: Status & Current logo info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-6 h-fit">
          <span className="text-sm font-bold text-gray-900">
            Current Website Logo
          </span>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-3" />
              Checking current status...
            </div>
          ) : currentFileUrl ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5 text-emerald-600 bg-emerald-50 border border-emerald-100/50 rounded-xl p-4 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Logo is Live</span>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/20 flex flex-col gap-4 items-center">
                <div className="w-full h-32 flex items-center justify-center bg-white border border-gray-200 rounded-lg overflow-hidden p-2">
                  <img
                    src={getImageUrl(currentFileUrl)}
                    alt="Current Website Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                <a
                  href={getImageUrl(currentFileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2.5 w-full rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                  View Full Image
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/20">
              <ImageIcon className="w-8 h-8 text-gray-300 mb-3" />
              <span className="text-sm font-semibold text-gray-500 mb-1">
                No Logo Uploaded
              </span>
              <p className="text-xs text-gray-400 px-4">
                Please upload a branding logo to display on the public website headers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
