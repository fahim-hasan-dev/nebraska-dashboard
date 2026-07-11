"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash, Pencil } from "lucide-react";
import DeleteModal from "../modals/DeleteModal";
import Modal from "../modals/Modal";
import UserDetails from "../page/users/userDetails/UserDetails";
import EditDriverModal from "../page/users/EditDriverModal";

// table column definition creator
export const createUserTableColumns = (
  onDelete: (id: string) => Promise<void>,
  onUpdateSuccess?: () => void
): ColumnDef<IUser>[] => [
  {
    id: "slNo",
    header: "Sl. No",
    cell: ({ row }) => {
      return <p className="px-2 font-semibold text-gray-700">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      const item = row.original as IUser;
      return <p className="px-2 font-bold text-gray-900">{item?.fullName}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const item = row.original as IUser;
      return <p className="px-2 text-gray-600 font-medium">{item?.email}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const item = row.original as IUser;
      return <p className="px-2 text-gray-600 font-medium">{item?.phone || "N/A"}</p>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const item = row.original as IUser;
      return (
        <Badge
          className={`capitalize font-bold text-xs py-1 px-3 shadow-none rounded-full border ${
            item?.role === "admin"
              ? "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-50"
              : item?.role === "driver"
              ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50"
              : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >
          {item?.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original as IUser;
      return (
        <Badge
          className={`capitalize font-bold text-xs py-1 px-3 shadow-none rounded-full border ${
            item?.status === "active"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              : item?.status === "restricted"
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-50"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50"
          }`}
        >
          {item?.status || "active"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <Modal
            dialogTrigger={
              <Button variant="ghost" size="icon" className="text-[#3b82f6] hover:bg-blue-50 hover:text-blue-600">
                <Eye className="w-4 h-4" />
              </Button>
            }
            dialogTitle="User Profile Details"
            className="max-w-[100vw] lg:max-w-lg"
          >
            <UserDetails user={item} />
          </Modal>

          {/* Render edit option conditionally: Only for drivers created by the admin who haven't completed manual signup */}
          {item.role === "driver" && item.adminCreated && !item.email && (
            <EditDriverModal driver={item} onSuccess={onUpdateSuccess}>
              <Button variant="ghost" size="icon" className="text-amber-500 hover:bg-amber-50 hover:text-amber-600">
                <Pencil className="w-4 h-4" />
              </Button>
            </EditDriverModal>
          )}

          <DeleteModal
            triggerBtn={
              <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash className="w-4 h-4" />
              </Button>
            }
            title="Delete User Account"
            description={`Are you sure you want to permanently delete the account of ${item.fullName}? This action cannot be undone.`}
            actionBtnText="Delete Account"
            itemId={item?._id}
            action={onDelete}
          />
        </div>
      );
    },
  },
];
