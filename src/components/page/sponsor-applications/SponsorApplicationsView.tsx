/* eslint-disable @typescript-eslint/no-explicit-any */
import { Building2, Mail, Phone } from "lucide-react";

export default function SponsorApplicationsView({ applications }: { applications: any[] }) {
  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Sponsor Applications
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage sponsor partnership requests
        </p>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4">
        {applications?.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6"
          >
            {/* Card Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-gray-900 text-lg leading-tight">
                  {app.company}
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  {app.submittedAt}
                </span>
              </div>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium">
                  Contact Person
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  {app.contactPerson}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </div>
                <span className="text-gray-700 text-sm">{app.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Phone</span>
                </div>
                <span className="text-gray-700 text-sm">{app.phone}</span>
              </div>
            </div>

            {/* Message Box */}
            <div className="bg-[#f8f9fa] rounded-lg p-4 flex flex-col gap-1.5 border border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Message</span>
              <p className="text-sm text-gray-700 italic">
                {app.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
