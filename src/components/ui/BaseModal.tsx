"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BaseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  maxWidthClassName?: string;
  children: React.ReactNode;
}

export default function BaseModal({
  isOpen,
  onOpenChange,
  title,
  maxWidthClassName = "sm:max-w-[500px]",
  children,
}: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidthClassName} p-0 border-0 rounded-2xl bg-white shadow-xl overflow-hidden`}>
        <div className="p-8 w-full max-w-full">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
              {title}
            </DialogTitle>
          </DialogHeader>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
