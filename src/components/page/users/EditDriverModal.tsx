"use client";

import { useState, useEffect } from "react";
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
import { Pencil, Loader2, Plus, Trash } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import { IUser } from "@/types/user";

interface EditDriverModalProps {
  driver: IUser;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export default function EditDriverModal({ driver, children, onSuccess }: EditDriverModalProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tractorNames, setTractorNames] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with driver details when modal opens or driver changes
  useEffect(() => {
    if (open && driver) {
      setFullName(driver.fullName || "");
      setPhone(driver.phone || "");
      setTractorNames(driver.tractorName && driver.tractorName.length > 0 ? [...driver.tractorName] : [""]);
    }
  }, [open, driver]);

  const handleEditDriver = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error("Full Name is required");
    if (!phone.trim()) return toast.error("Phone number is required");
    
    const filledTractors = tractorNames.map((t) => t.trim()).filter(Boolean);
    if (filledTractors.length === 0) {
      return toast.error("At least one Tractor Name is required");
    }

    setIsSubmitting(true);
    toast.loading("Updating driver account...", { id: "edit-driver" });

    try {
      const res = await myFetch(`/user/driver/${driver._id}`, {
        method: "PATCH",
        body: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          tractorName: filledTractors,
        },
      });

      if (res.success) {
        toast.success("Driver account updated successfully!", { id: "edit-driver" });
        setOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(res.message || "Failed to update driver account.", { id: "edit-driver" });
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      toast.error("An error occurred during account update.", { id: "edit-driver" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-[#3b82f6]" />
            Edit Driver Account
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-600 outline-none" />
        </DialogHeader>

        <form onSubmit={handleEditDriver} className="px-6 py-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
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

          <div className="flex flex-col gap-2">
            <Label>Tractor Names *</Label>
            {tractorNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => {
                    const newNames = [...tractorNames];
                    newNames[index] = e.target.value;
                    setTractorNames(newNames);
                  }}
                  placeholder={`e.g. Tractor #${index + 1}`}
                  required
                />
                {tractorNames.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newNames = [...tractorNames];
                      newNames.splice(index, 1);
                      setTractorNames(newNames);
                    }}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTractorNames([...tractorNames, ""])}
              className="mt-1 w-fit text-xs font-semibold text-[#3b82f6] border-[#3b82f6]/20 hover:bg-[#3b82f6]/5 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Tractor
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 font-semibold">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-[#3b82f6] text-white hover:bg-blue-600 font-bold"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
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
