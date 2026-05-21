"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import { myFetch } from "@/utils/myFetch";

interface SearchableInfiniteSelectProps {
  placeholder?: string;
  endpoint: string;
  fields?: string;
  extraParams?: Record<string, string>;
  value: string;
  onChange: (value: string, selectedItem?: any) => void;
  disabled?: boolean;
  displayValue: (item: any) => string;
  className?: string;
  transformData?: (data: any[]) => any[];
}

export default function SearchableInfiniteSelect({
  placeholder = "Select option",
  endpoint,
  fields,
  extraParams = {},
  value,
  onChange,
  disabled = false,
  displayValue,
  className = "",
  transformData,
}: SearchableInfiniteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch items from API
  const fetchItems = useCallback(
    async (currentPage: number, searchStr: string, isAppend: boolean = false) => {
      if (disabled) return;
      if (isLoading) return;
      setIsLoading(true);

      const currentLimit = 15;
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(currentLimit),
          ...(fields ? { fields } : {}),
          ...(searchStr ? { searchTerm: searchStr } : {}),
          ...extraParams,
        });

        const res = await myFetch(`${endpoint}?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.success && res.data) {
          let rawData = Array.isArray(res.data) ? res.data : (res.data.data || []);
          
          if (transformData) {
            rawData = transformData(rawData);
          }

          if (isAppend) {
            setItems((prev) => {
              const uniqueItems = [...prev];
              rawData.forEach((item: any) => {
                const id = item._id || item.id;
                if (!uniqueItems.some((u) => (u._id || u.id) === id)) {
                  uniqueItems.push(item);
                }
              });
              return uniqueItems;
            });
          } else {
            setItems(rawData);
          }

          const meta = (res.pagination || {}) as any;
          const totalPage = meta.totalPage || Math.ceil((meta.total || 0) / currentLimit);
          setHasMore(currentPage < totalPage && rawData.length >= currentLimit);
        } else {
          if (!isAppend) setItems([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading items in SearchableInfiniteSelect:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, fields, JSON.stringify(extraParams), transformData, disabled, isLoading]
  );

  // Initial fetch / load details when value is set or changes
  useEffect(() => {
    if (!value) {
      setSelectedItem(null);
      return;
    }

    const found = items.find((item) => (item._id || item.id) === value);
    if (found) {
      setSelectedItem(found);
    } else {
      // Retrieve individual selected item details if not yet in loaded items
      const fetchDetail = async () => {
        try {
          const res = await myFetch(`${endpoint}/${value}`, { method: "GET" });
          if (res.success && res.data) {
            let itemData = res.data;
            if (transformData) {
              const transformed = transformData([itemData]);
              itemData = transformed[0] || itemData;
            }
            setSelectedItem(itemData);
          }
        } catch (err) {
          console.error("Error retrieving selected item details:", err);
          setSelectedItem(null);
        }
      };
      fetchDetail();
    }
  }, [value, items, endpoint, transformData]);

  // Handle open dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  // Trigger search on typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchItems(1, val, false);
    }, 300);
  };

  // Scroll to bottom listener inside the dropdown
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (isLoading || !hasMore) return;

    // Use a robust threshold of 50px to handle decimal scrolling differences and zoom levels
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage, searchTerm, true);
    }
  };

  // Initial load page 1 on mount or when key dependencies change
  useEffect(() => {
    if (disabled) {
      setItems([]);
      setSelectedItem(null);
      return;
    }
    setPage(1);
    setSearchTerm("");
    fetchItems(1, "", false);
  }, [endpoint, fields, JSON.stringify(extraParams), disabled]);

  // Reset search when opened/closed if search is non-empty
  useEffect(() => {
    if (isOpen && searchTerm !== "") {
      setPage(1);
      setSearchTerm("");
      fetchItems(1, "", false);
    }
  }, [isOpen]);

  // Click outside behavior
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger element button */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-left transition-all"
      >
        <span className="truncate">
          {selectedItem ? displayValue(selectedItem) : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
      </button>

      {/* Popover overlay dropdown */}
      {isOpen && (
        <div className="absolute z-[999] mt-2 w-full rounded-xl border border-gray-150 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search bar input container */}
          <div className="flex items-center border-b border-gray-100 px-3 py-2 bg-gray-50/50">
            <Search className="h-4 w-4 text-gray-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none py-1 font-medium"
              autoFocus
            />
          </div>

          {/* Options container list */}
          <div
            onScroll={handleScroll}
            className="max-h-60 overflow-y-auto divide-y divide-gray-50/50 py-1"
          >
            {items.map((item) => {
              const id = item._id || item.id;
              const isSelected = value === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onChange(id, item);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-sm text-left hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium ${
                    isSelected ? "bg-blue-50/40 text-blue-600 font-semibold" : "text-gray-700"
                  }`}
                >
                  <span className="truncate">{displayValue(item)}</span>
                </button>
              );
            })}

            {/* Loaders and status elements */}
            {isLoading && (
              <div className="flex items-center justify-center py-3 text-xs text-gray-400 gap-1.5 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                Loading options...
              </div>
            )}

            {!isLoading && items.length === 0 && (
              <div className="py-4 text-center text-xs text-gray-400 font-medium">
                No matching results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
