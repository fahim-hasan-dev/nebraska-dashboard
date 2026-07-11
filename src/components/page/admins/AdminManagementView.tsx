/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { 
  Users, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Search, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useListQuery } from "@/hooks/useListQuery";
import AddAdminModal from "./AddAdminModal";

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

  // Integrated list query management for administrators
  const {
    data: adminsList,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    totalItems: totalAdmins,
    refresh: fetchAdmins,
  } = useListQuery<any>({
    endpoint: "/user/admin",
    initialParams: { limit: "10" },
  });

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

        {/* Refactored Modular Admin Addition Modal */}
        <AddAdminModal onSuccess={fetchAdmins} />
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
