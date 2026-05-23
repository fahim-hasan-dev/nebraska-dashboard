/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Building2, Mail, Phone, Search, Loader2 } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { CustomPagination } from "@/components/ui/custom-pagination";

export default function SponsorApplicationsView() {
  const [applicationsList, setApplicationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [hasLoadedFromApi, setHasLoadedFromApi] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce search query changes to prevent heavy server load
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);



  // Fetch sponsor applications from API using 'searchTerm'
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "15");
      if (debouncedSearchQuery) {
        params.append("searchTerm", debouncedSearchQuery);
      }

      const res = await myFetch(`/sponsor-request?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.success && res.data) {
        const list = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.data && Array.isArray(res.data.data) ? res.data.data : []);
        setApplicationsList(list);
        setHasLoadedFromApi(true);

        if (res.pagination) {
          setTotalPages(res.pagination.totalPage || 1);
          setTotalItems(res.pagination.total || list.length);
        } else {
          setTotalPages(1);
          setTotalItems(list.length);
        }
      }
    } catch (error) {
      console.error("Error fetching sponsor applications:", error);
      toast.error("Failed to load sponsor requests from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchApplications();
    } else {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const filteredApplications = applicationsList.filter((app) => {
    const search = debouncedSearchQuery.toLowerCase();
    const businessName = app.businessName || app.company || "";
    const contactPerson = app.user?.fullName || app.contactPerson || app.name || "";
    const email = app.user?.email || app.email || "";
    const phone = app.user?.phone || app.phone || "";
    const message = app.message || "";
    return (
      businessName.toLowerCase().includes(search) ||
      contactPerson.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      phone.toLowerCase().includes(search) ||
      message.toLowerCase().includes(search)
    );
  });

  const getFormattedDate = (app: any) => {
    if (app.createdAt) {
      return "Submitted " + new Date(app.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    return app.submittedAt || "Submitted N/A";
  };

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Page Header and Search Bar Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Sponsor Applications
          </h1>
          <p className="text-sm text-gray-500">
            Review and manage sponsor partnership requests
          </p>
        </div>

        {/* Premium Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Applications List & Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          Loading applications...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
          <Building2 className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold text-sm">No applications found</p>
          <p className="text-xs text-gray-400 mt-1">Try resetting your search query</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {filteredApplications.map((app) => (
              <div
                key={app._id || app.id}
                className="bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-6 flex flex-col gap-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
              >
                {/* Card Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100/50">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">
                      {app.businessName || app.company}
                    </h2>
                    <span className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1.5">
                      {getFormattedDate(app)}
                    </span>
                  </div>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Contact Person
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      {app.user?.fullName || app.contactPerson || app.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </div>
                    <a href={`mailto:${app.user?.email || app.email}`} className="text-blue-500 hover:underline text-sm font-medium">
                      {app.user?.email || app.email}
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone</span>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {app.user?.phone || app.phone || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Message Box */}
                {app.message && (
                  <div className="bg-[#f0f7ff] rounded-lg p-4 flex flex-col gap-1.5 border border-blue-50/50">
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Message</span>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {app.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Centered Pagination */}
          <CustomPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
