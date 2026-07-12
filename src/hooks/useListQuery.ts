import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface UseListQueryOptions {
  endpoint: string;
  initialParams?: Record<string, string>;
  debounceMs?: number;
  skip?: boolean;
}

/**
 * A reusable hook to manage paginated list queries with search, debounce, and filtering.
 */
export function useListQuery<T>({
  endpoint,
  initialParams = {},
  debounceMs = 400,
  skip = false,
}: UseListQueryOptions) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = Number(initialParams.limit || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Custom dynamic filter states (updated via updateFilters)
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});

  // Sync initialParams and customFilters
  const initialParamsString = JSON.stringify(initialParams);
  const filters: Record<string, string> = useMemo(() => {
    const rest = JSON.parse(initialParamsString);
    delete rest.limit;
    return { ...rest, ...customFilters };
  }, [initialParamsString, customFilters]);

  // Adjust state synchronously when initialParams change to avoid double rendering
  const [prevParamsString, setPrevParamsString] = useState(initialParamsString);
  if (initialParamsString !== prevParamsString) {
    setPrevParamsString(initialParamsString);
    setPage(1);
  }

  // Debounce the search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset back to page 1 whenever a new search query is typed
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const requestCountRef = useRef(0);

  // Main data fetching logic
  const fetchData = useCallback(async () => {
    if (skip) {
      setData([]);
      setIsLoading(false);
      return;
    }

    const currentRequestId = ++requestCountRef.current;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));

      // Append any active filter categories
      Object.entries(filters).forEach(([key, val]) => {
        if (val) {
          queryParams.append(key, val);
        }
      });

      // Append search term if present
      if (debouncedSearch.trim()) {
        queryParams.append("searchTerm", debouncedSearch.trim());
      }

      const res = await myFetch(`${endpoint}?${queryParams.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (currentRequestId !== requestCountRef.current) {
        return;
      }

      if (res.success && res.data) {
        // Standardize different API response list layouts (res.data, data, admins, users, events)
        let list: T[] = [];
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (res.data.admins && Array.isArray(res.data.admins)) {
          list = res.data.admins;
        } else if (res.data.users && Array.isArray(res.data.users)) {
          list = res.data.users;
        } else if (res.data.events && Array.isArray(res.data.events)) {
          list = res.data.events;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          list = res.data.data;
        }
        setData(list);

        // Update pagination details, with custom fallbacks for specific dashboard metrics
        const meta: any = res.pagination || {};
        const total = res.data?.staticData?.totalAdmins || meta.total || list.length;
        const pages = meta.totalPage || 1;
        setTotalPages(pages);
        setTotalItems(total);
      } else {
        setData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error(`Error loading data from ${endpoint}:`, error);
      toast.error("Failed to load records from server");
    } finally {
      if (currentRequestId === requestCountRef.current) {
        setIsLoading(false);
      }
    }
  }, [endpoint, page, limit, debouncedSearch, filters, skip]);

  // Automatically fetch data whenever dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper function to update filters cleanly
  const updateFilters = useCallback((newFilters: Record<string, string>) => {
    setCustomFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter changes
  }, []);

  return {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalItems,
    filters,
    setFilters: updateFilters,
    refresh: fetchData,
  };
}
