"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import BaseModal from "@/components/ui/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { myFetch } from "@/utils/myFetch";
import { adminSchema, AdminFormValues } from "@/schemas/formSchemas/adminSchema";

interface AddAdminModalProps {
  onSuccess: () => void;
}

export default function AddAdminModal({ onSuccess }: AddAdminModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with Zod schema validation
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: AdminFormValues) => {
    setIsSubmitting(true);
    const toastId = "create-admin";
    toast.loading("Creating admin account...", { id: toastId });

    try {
      const res = await myFetch("/user/admin", {
        method: "POST",
        body: values,
      });

      if (res.success) {
        toast.success("Admin account created successfully!", { id: toastId });
        form.reset();
        setIsOpen(false);
        onSuccess();
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear form errors/values on modal close
      form.reset();
    }
  };

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        className="bg-[#3b82f6] hover:bg-blue-600 text-white h-10 px-6 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add New Admin
      </Button>
      
      <BaseModal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        maxWidthClassName="sm:max-w-[450px]"
        title={
          <>
            <Users className="w-6 h-6 text-blue-500" />
            Add Administrator
          </>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-600 font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      className="h-11 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg text-sm font-semibold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-600 font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., example@domain.com"
                      className="h-11 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg text-sm font-semibold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-600 font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., +1234567890"
                      className="h-11 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-lg text-sm font-semibold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modal Actions */}
            <div className="flex justify-between items-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 flex items-center justify-center"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="flex-1 h-11 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Admin
              </button>
            </div>
          </form>
        </Form>
      </BaseModal>
    </>
  );
}
