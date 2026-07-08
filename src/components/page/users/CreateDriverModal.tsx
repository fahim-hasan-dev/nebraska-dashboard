"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Key } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";

interface CreateDriverModalProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export default function CreateDriverModal({ children, onSuccess }: CreateDriverModalProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error("Full Name is required");
    if (!phone.trim()) return toast.error("Phone number is required");
    if (!vehicleName.trim()) return toast.error("Vehicle Name is required");

    setIsSubmitting(true);
    toast.loading("Creating driver account...", { id: "create-driver" });

    try {
      const res = await myFetch("/user/create-driver", {
        method: "POST",
        body: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          vehicleName: vehicleName.trim(),
        },
      });

      if (res.success) {
        toast.success("Driver account created successfully!", { id: "create-driver" });
        setOpen(false);
        // Reset form
        setFullName("");
        setPhone("");
        setVehicleName("");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(res.message || "Failed to create driver account.", { id: "create-driver" });
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      toast.error("An error occurred during account creation.", { id: "create-driver" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        // Reset on close
        setFullName("");
        setPhone("");
        setVehicleName("");
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#3b82f6]" />
            Create Driver Account
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>

        <form onSubmit={handleCreateDriver} className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="e.g. +1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vehicleName">Vehicle Name *</Label>
            <Input
              id="vehicleName"
              placeholder="e.g. Iron Horse"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 font-semibold">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-[#3b82f6] text-white hover:bg-blue-600 font-bold"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Create Driver
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
