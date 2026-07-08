"use client";

import { UserMinus, ShieldAlert } from "lucide-react";

export default function DeleteUserAccountPage() {
  const steps = [
    "Navigate to the Account screen from the bottom navigation bar.",
    'Select "Delete Account" from the list.',
    "In the pop-up, provide your current password in the required field.",
    "Tap the Delete button to permanently remove your account and data."
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-600 rounded-2xl mb-4 border border-red-100 shadow-sm animate-pulse">
            <UserMinus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Delete User Account
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-500">
            Follow the instructions below to permanently remove your account and associated data.
          </p>
        </div>

        {/* Main Content Card (Stacked Layout) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm flex flex-col items-center gap-10">
          
          {/* 1. Image in the Top (Increased Size) */}
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100 mb-6">
              <ShieldAlert className="w-3.5 h-3.5" />
              Permanent Action
            </div>
            
            <div className="relative w-full max-w-[680px] bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-inner">
              <img
                src="/deletaccount.png"
                alt="Delete account guideline"
                className="w-full h-auto object-contain rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          </div>

          {/* 2. Instructions at the Bottom */}
          <div className="w-full pt-8 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 text-center sm:text-left">
              Step-by-Step Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#3b82f6] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Subdued Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Nebraska Bush Pullers. All rights reserved.
        </div>
      </div>
    </div>
  );
}
