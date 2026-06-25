import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto pb-20 animate-pulse p-4 sm:p-6 md:p-8">
      {/* Skeleton Title & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          {/* Page Title skeleton */}
          <div className="h-8 w-48 sm:w-64 bg-gray-200 rounded-lg" />
          {/* Subtitle skeleton */}
          <div className="h-4 w-32 sm:w-40 bg-gray-100 rounded" />
        </div>
        {/* Action Button skeleton */}
        <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-lg shrink-0" />
      </div>

      {/* Optional Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded-lg mt-1" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white border border-gray-150/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        {/* Filter controls skeleton */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="h-11 w-full sm:w-60 bg-gray-100 rounded-lg" />
          <div className="h-11 w-full sm:w-48 bg-gray-100 rounded-lg" />
          <div className="h-11 w-full sm:w-40 bg-gray-100 rounded-lg" />
        </div>

        {/* Loading Spinner with Text */}
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm font-medium">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <span className="text-gray-500 font-semibold">Loading dashboard content...</span>
        </div>

        {/* Skeleton List Rows */}
        <div className="flex flex-col gap-4 mt-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-28 sm:w-40 bg-gray-200 rounded" />
                  <div className="h-3.5 w-20 sm:w-24 bg-gray-150 rounded" />
                </div>
              </div>
              <div className="hidden sm:block h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
