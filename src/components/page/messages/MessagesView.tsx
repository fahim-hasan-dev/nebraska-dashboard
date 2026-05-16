/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertCircle, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function MessagesView({ messages }: { messages: any[] }) {
  const [userType, setUserType] = useState<"driver" | "fans">("driver");

  return (
    <div className="flex flex-col w-full h-full max-w-[1000px] mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Message Board
        </h1>
      </div>

      {/* Post New Message Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-6">Post New Message</h2>
        
        <div className="flex flex-col gap-4">
          {/* User Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              User Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setUserType("driver")}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  userType === "driver"
                    ? "bg-[#3b82f6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => setUserType("fans")}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  userType === "fans"
                    ? "bg-[#3b82f6] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Fans
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Weather Delay, Schedule Change"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="Enter your message here..."
              className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div>
            <button className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors mt-2 w-full sm:w-auto">
              <Send className="w-4 h-4" />
              Post Message
            </button>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex flex-col gap-4">
        {messages?.map((msg) => (
          <div key={msg.id} className="bg-[#f0f7ff] border border-blue-200 rounded-xl p-4 flex gap-3">
            <div className="pt-0.5">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-700 font-semibold mb-1">{msg.title}</h3>
              <p className="text-blue-500 text-sm">
                {msg.message}
              </p>
            </div>
            <div className="flex items-start gap-1.5 text-blue-400 text-xs font-medium pt-0.5">
              <Clock className="w-4 h-4" />
              <span>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
