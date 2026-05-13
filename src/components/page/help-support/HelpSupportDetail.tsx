import { Eye, FileText, ArrowLeft } from "lucide-react";

interface HelpSupportDetailProps {
  ticket: any;
  onBack: () => void;
}

export function HelpSupportDetail({ ticket, onBack }: HelpSupportDetailProps) {
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
          <span className="text-sm text-gray-500">{ticket.user.name}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Date :</span>
          <span className="text-sm text-gray-500">{ticket.date}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Status :</span>
          <span className="text-sm text-gray-500">{ticket.status}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-gray-900">Title :</span>
          <span className="text-sm text-gray-500">{ticket.title}</span>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="flex flex-col gap-4">
        {/* Banner Image Mock */}
        <div className="w-full h-[200px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-8 h-8 text-gray-700" />
          </div>
          <div className="w-full h-full bg-gradient-to-r from-blue-100 via-purple-50 to-orange-100 flex items-center justify-center">
            <span className="text-gray-400 font-medium">Attached Screenshot Image</span>
          </div>
        </div>

        {/* PDF Attachment Mock */}
        <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center relative">
              <FileText className="w-6 h-6 text-gray-400" />
              <span className="absolute bottom-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-sm">PDF</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900">Message :</label>
        <div className="w-full min-h-[80px] bg-[#f0f7ff] border border-blue-100 rounded-lg p-4 text-sm text-gray-600">
          {ticket.message}
        </div>
      </div>

      {/* Reply */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-900">Your Reply :</label>
        <textarea
          placeholder="Type Your Response Here."
          className="w-full min-h-[100px] bg-[#f0f7ff] border border-blue-100 rounded-lg p-4 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y placeholder:text-gray-400"
        />
      </div>

      {/* Action */}
      <div>
        <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2.5 rounded-md font-medium text-sm transition-colors w-full sm:w-auto">
          Resolved
        </button>
      </div>
    </div>
  );
}
