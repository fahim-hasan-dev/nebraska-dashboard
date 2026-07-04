/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Search, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";
import { useAuthContext } from "@/contexts/AuthContext";

export default function AdminManagementView() {
  const { user } = useAuthContext();

  // Determine user role
  const userRole = useMemo(() => {
    try {
      if (!user) return "";
      const parsed = typeof user === "string" ? JSON.parse(user) : user;
      return parsed?.role || "";
    } catch {
      return "";
    }
  }, [user]);

  // List states
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Add Admin Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch admin list
  const fetchAdmins = async () => {
    if (userRole !== "super-admin" && userRole !== "super_admin") return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (debouncedSearch.trim()) {
        queryParams.append("searchTerm", debouncedSearch.trim());
      }

      const res = await myFetch(`/user/admin?${queryParams.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.success && res.data) {
        setAdminsList(res.data.admins || []);
        setTotalAdmins(res.data.staticData?.totalAdmins || res.data.meta?.total || 0);
        setTotalPages(res.data.meta?.totalPage || 1);
      } else {
        setAdminsList([]);
        setTotalAdmins(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load administrator accounts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, debouncedSearch, userRole]);

  // Handle create admin submit
  const handleAddAdmin = async () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setIsSubmitting(true);
    const toastId = "create-admin";
    toast.loading("Creating admin account...", { id: toastId });

    try {
      const res = await myFetch("/user/admin", {
        method: "POST",
        body: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
      });

      if (res.success) {
        toast.success("Admin account created successfully!", { id: toastId });
        // Reset state
        setFullName("");
        setEmail("");
        setPhone("");
        setIsAddModalOpen(false);
        fetchAdmins();
      } else {
        toast.error(res.message || "Failed to create admin account", { id: toastId });
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle admin active/restricted status
  const handleToggleStatus = async (admin: any) => {
    const nextStatus = admin.status === "active" ? "restricted" : "active";
    const toastId = `status-${admin._id}`;
    toast.loading(`Updating status...`, { id: toastId });

    try {
      const res = await myFetch(`/user/admin/${admin._id}/status`, {
        method: "PATCH",
        body: { status: nextStatus },
      });

      if (res.success) {
        toast.success(`Admin account status set to ${nextStatus}`, { id: toastId });
        fetchAdmins();
      } else {
        toast.error(res.message || "Failed to update admin status", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast.error("An error occurred while updating account status", { id: toastId });
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId: string) => {
    const toastId = "delete-admin";
    toast.loading("Deleting admin account...", { id: toastId });

    try {
      const res = await myFetch(`/user/admin/${adminId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Admin account deleted successfully!", { id: toastId });
        fetchAdmins();
      } else {
        toast.error(res.message || "Failed to delete admin account", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting admin account:", error);
      toast.error("An error occurred while deleting account", { id: toastId });
    }
  };

  // Return Access Denied for non-super-admins
  if (userRole !== "super-admin" && userRole !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-[600px] mx-auto my-12">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-sm text-gray-500 max-w-md leading-relaxed">
          You do not have permission to view this section. Only Super Administrators are authorized to access administrator account lists and management tools.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create, search, restrict, and manage system administrator credentials.
          </p>
        </div>

        {/* Add Admin Dialog */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white h-10 px-6 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] p-0 border-0 rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="p-8 w-full max-w-full">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  Add Administrator
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-gray-600 font-medium text-sm">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="h-11 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-600 font-medium text-sm">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="h-11 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-gray-600 font-medium text-sm">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +1 (555) 019-2834"
                    className="h-11 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                    disabled={isSubmitting}
                  />
                </div>



                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAdmin}
                    className="flex-1 h-11 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Admin
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search administrators by name, email, or phone..."
          className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1"
        />
      </div>

      {/* Main Content Presentation */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm font-medium bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            Loading administrator list...
          </div>
        ) : adminsList.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-500">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No admin accounts found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {searchTerm.trim() 
                ? "No administrator accounts match your search filters."
                : "There are no administrator accounts recorded in the database yet."}
            </p>
          </div>
        ) : (
          /* Table Standings rendering */
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-150 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Administrator Accounts
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                {totalAdmins} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-bold text-gray-400 bg-gray-50/30 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminsList.map((admin) => {
                    const isActive = admin.status === "active" || admin.status === "ACTIVE";
                    
                    return (
                      <tr 
                        key={admin._id || admin.id} 
                        className="bg-white hover:bg-slate-50/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {admin.fullName}
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{admin.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{admin.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isActive 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {isActive ? "Active" : "Restricted"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                          {/* Toggle Status Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(admin)}
                            title={isActive ? "Restrict Admin Account" : "Activate Admin Account"}
                            className={`p-2 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                              isActive 
                                ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50 border-transparent hover:border-amber-100" 
                                : "text-green-500 hover:text-green-600 hover:bg-green-50 border-transparent hover:border-green-100"
                            }`}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          {/* Delete Action Trigger */}
                          <DeleteModal
                            itemId={admin._id || admin.id}
                            triggerBtn={
                              <button
                                title="Delete Admin"
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all active:scale-95 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            }
                            title="Delete Admin Account"
                            description={`Are you absolutely sure you want to delete administrator account "${admin.fullName}"? This action cannot be undone.`}
                            actionBtnText="Delete"
                            action={handleDeleteAdmin}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
