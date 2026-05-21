import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({ page, totalPages, onPageChange }: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const maxVisible = 10;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      if (page <= 6) {
        for (let i = 1; i <= 8; i++) {
          range.push(i);
        }
        range.push("...");
        range.push(totalPages);
      } else if (page >= totalPages - 5) {
        range.push(1);
        range.push("...");
        for (let i = totalPages - 7; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        range.push(1);
        range.push("...");
        for (let i = page - 3; i <= page + 3; i++) {
          range.push(i);
        }
        range.push("...");
        range.push(totalPages);
      }
    }
    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex justify-center items-center mt-10 gap-4 py-4 border-t border-gray-100/50 animate-fadeIn">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-md"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {paginationRange.map((p, i) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-sm font-bold text-[#A7A7A7]"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#3b82f6] hover:bg-blue-600 text-white font-bold transform scale-105"
                  : "text-[#A7A7A7] hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-md"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
