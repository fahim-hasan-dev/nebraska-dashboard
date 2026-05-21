/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, FileText, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getImageUrl as getFileUrl } from "@/utils/imageUrl";

interface HelpSupportDetailProps {
  ticket: any;
  onBack: () => void;
  onResolve: (ticketId: string, reply: string) => Promise<boolean>;
}

export function HelpSupportDetail({ ticket, onBack, onResolve }: HelpSupportDetailProps) {
  const [replyText, setReplyText] = useState(ticket.reply || "");
  const [isResolving, setIsResolving] = useState(false);

  const isResolved = ticket.status === "resolved" || ticket.status === "Solved";
  const userName = ticket.user?.fullName || ticket.user?.name || "Anonymous User";
  const ticketDate = ticket.createdAt 
    ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) 
    : (ticket.date || "N/A");

  const handleResolveClick = async () => {
    if (!replyText.trim()) {
      toast.error("Please provide a reply note before resolving this ticket.");
      return;
    }
    
    setIsResolving(true);
    const success = await onResolve(ticket._id, replyText);
    setIsResolving(false);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-8 w-full max-w-[1000px]">
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">From :</span>
          <span className="text-sm text-gray-500">{userName}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Date :</span>
          <span className="text-sm text-gray-500">{ticketDate}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Status :</span>
          <span className="text-sm text-gray-500 capitalize">{ticket.status}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Title :</span>
          <span className="text-sm text-gray-500">{ticket.title}</span>
        </div>
      </div>

      {/* Attachments Section */}
      {ticket.file ? (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-900">Attachment :</label>
          {ticket.file.match(/\.(jpeg|jpg|gif|png|webp)/i) ? (
            <a 
              href={getFileUrl(ticket.file)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full h-[250px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative group cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Eye className="w-8 h-8 text-white animate-pulse" />
              </div>
              <img
                src={getFileUrl(ticket.file)}
                alt="Support Ticket Attachment"
                className="w-full h-full object-contain"
              />
            </a>
          ) : (
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center relative">
                  <FileText className="w-6 h-6 text-gray-400" />
                  <span className="absolute bottom-1 bg-blue-500 text-white text-[9px] font-bold px-1 rounded-sm uppercase">
                    {ticket.file.split('.').pop() || "FILE"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">Support Attachment File</span>
                  <span className="text-xs text-gray-400">Click preview button to open file</span>
                </div>
              </div>
              <a
                href={getFileUrl(ticket.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      ) : (
        /* Support static fallback sample attachments if editing mock details */
        !ticket._id && (
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold text-gray-900">Attachments :</span>
            <div className="w-full h-[150px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center">
              <span className="text-gray-400 font-medium text-xs">No screenshots attached</span>
            </div>
          </div>
        )
      )}

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900">Message :</label>
        <div className="w-full min-h-[80px] bg-[#f0f7ff] border border-blue-100 rounded-lg p-4 text-sm text-gray-600">
          {ticket.description || ticket.message}
        </div>
      </div>

      {/* Reply */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900">Your Reply :</label>
        <textarea
          placeholder="Type Your Response Here."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          disabled={isResolved || isResolving}
          className="w-full min-h-[100px] bg-[#f0f7ff] border border-blue-100 rounded-lg p-4 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200"
        />
      </div>

      {/* Action */}
      <div>
        {isResolved ? (
          <div className="inline-flex items-center px-6 py-2.5 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Resolved Ticket
          </div>
        ) : (
          <button
            onClick={handleResolveClick}
            disabled={isResolving}
            className="bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-md font-medium text-sm transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isResolving && <Loader2 className="w-4 h-4 animate-spin" />}
            Resolve Request
          </button>
        )}
      </div>
    </div>
  );
}
