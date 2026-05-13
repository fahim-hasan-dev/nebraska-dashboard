import { Upload } from "lucide-react";

export default function RulebookView() {
  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Rulebook Management
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-gray-600">
          Upload Pdf
        </label>

        {/* Dropzone */}
        <div className="border border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-4" />
          <span className="text-sm font-semibold text-gray-700 mb-1">
            Click to upload pdf
          </span>
          <span className="text-xs text-gray-400">pdf</span>
        </div>

        {/* Action Button */}
        <div>
          <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors mt-2 w-full sm:w-auto">
            Update Rulebook
          </button>
        </div>
      </div>
    </div>
  );
}
