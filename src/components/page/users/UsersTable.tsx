"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createUserTableColumns } from "@/components/tableColumns/userTableColumn";
import { capitalizeSentence } from "@/utils/capitalizeSentence";
import { IUser } from "@/types/user";
import { useUpdateMultiSearchParams } from "@/hooks/useUpdateMultiSearchParams";
import DashboardTable from "@/components/shared/table";
import TablePagination from "@/components/shared/table-pagination";
import CreateDriverModal from "./CreateDriverModal";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface UsersTableProps {
  users: IUser[];
  filters: {
    role?: string;
    searchTerm?: string;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

const UsersTable = ({ users = [], filters, meta }: UsersTableProps) => {
  const router = useRouter();
  const updateMultiSearchParams = useUpdateMultiSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Search state
  const [searchVal, setSearchVal] = React.useState(filters?.searchTerm || "");

  // Debounced search trigger
  React.useEffect(() => {
    const currentSearchTerm = filters?.searchTerm || "";
    if (searchVal === currentSearchTerm) {
      return;
    }

    const delayDebounce = setTimeout(() => {
      updateMultiSearchParams({ searchTerm: searchVal || null, page: null });
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchVal, filters?.searchTerm, updateMultiSearchParams]);

  // Sync state if search filter changes externally
  React.useEffect(() => {
    setSearchVal(filters?.searchTerm || "");
  }, [filters?.searchTerm]);

  const handleDeleteUser = React.useCallback(async (id: string) => {
    toast.loading("Deleting user...", { id: "delete-user" });
    try {
      const res = await myFetch(`/user/${id}`, {
        method: "DELETE",
      });
      if (res.success) {
        toast.success("User deleted successfully!", { id: "delete-user" });
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete user.", { id: "delete-user" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user.", { id: "delete-user" });
    }
  }, [router]);

  const columns = React.useMemo(() => createUserTableColumns(handleDeleteUser), [handleDeleteUser]);

  const table = useReactTable<IUser>({
    data: users || [],
    columns: columns as ColumnDef<IUser>[],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const roles = ["driver", "fan"];

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-100 flex flex-col gap-6 mb-24">
      {/* Header Option Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 focus:border-[#3b82f6] transition-all font-semibold text-gray-800"
            />
          </div>

          {/* Role Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="capitalize shadow-none border-gray-200 h-11 font-semibold text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {filters?.role ? `${capitalizeSentence(filters.role)}` : "Role"}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 font-semibold text-gray-700">
              <DropdownMenuItem
                onClick={() =>
                  updateMultiSearchParams({ role: null, page: null })
                }
                className="cursor-pointer"
              >
                All Roles
              </DropdownMenuItem>
              {roles.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() =>
                    updateMultiSearchParams({ role: item, page: null })
                  }
                  className="cursor-pointer"
                >
                  {capitalizeSentence(item)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Create Manual Account Action */}
        <CreateDriverModal onSuccess={() => router.refresh()}>
          <button className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-5 h-11 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-[0.98] w-full md:w-auto">
            <Plus className="w-4 h-4" />
            Create Driver Account
          </button>
        </CreateDriverModal>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4 border border-gray-100 rounded-xl overflow-hidden">
        <DashboardTable table={table} columns={columns} />
        <TablePagination table={table} meta={meta} />
      </div>
    </div>
  );
};

export default UsersTable;
