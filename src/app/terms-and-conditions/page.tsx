"use client";

import { useEffect, useState } from "react";
import { Scale, AlertCircle, Loader2 } from "lucide-react";
import { myFetch } from "@/utils/myFetch";

const defaultTerms = `<h3>1. Introduction</h3>
<p>Welcome to Nebraska. By accessing our platform, you agree to these terms. Please read them carefully.</p>
<h3>2. Service Usage</h3>
<p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
<ul>
  <li>You must provide accurate account information.</li>
  <li>You are responsible for maintaining the confidentiality of your account.</li>
  <li>Unauthorized use of the platform is strictly prohibited.</li>
</ul>
<h3>3. Orders & Payments</h3>
<p>All transactions are subject to acceptance and availability. Prices are subject to change without notice.</p>
<h3>4. Intellectual Property</h3>
<p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.</p>`;

export default function TermsAndConditionsPage() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const res = await myFetch("/public/terms-and-condition", {
          method: "GET",
          cache: "no-store",
        });
        if (res.success && res.data) {
          setContent(res.data.content || defaultTerms);
        } else {
          setContent(defaultTerms);
        }
      } catch (err) {
        console.error("Error fetching terms:", err);
        setError("Could not retrieve the latest terms & conditions.");
        setContent(defaultTerms);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 sm:px-6 lg:px-8">
      {/* Custom styles for rendering rich text Jodit HTML content beautifully */}
      <style jsx global>{`
        .legal-content h1, .legal-content h2, .legal-content h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 0.5rem;
        }
        .legal-content p {
          font-size: 0.975rem;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 1.25rem;
        }
        .legal-content ul, .legal-content ol {
          list-style-type: disc;
          margin-left: 1.75rem;
          margin-bottom: 1.25rem;
          color: #4b5563;
        }
        .legal-content li {
          font-size: 0.975rem;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }
        .legal-content strong {
          color: #1f2937;
          font-weight: 600;
        }
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 no-print">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#3b82f6] shadow-sm border border-blue-100">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Terms & Conditions</h1>
              <p className="text-xs text-gray-500 mt-0.5">Nebraska Bush Pullers</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm print-card">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin mb-4" />
              <p className="text-sm font-medium">Retrieving terms content...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 no-print">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">
                    {error} Showing cached offline content.
                  </div>
                </div>
              )}

              <div 
                className="legal-content" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </>
          )}
        </div>

        {/* Subdued Footer Information */}
        <div className="mt-8 text-center text-xs text-gray-400 no-print">
          &copy; {new Date().getFullYear()} Nebraska Bush Pullers. All rights reserved.
        </div>
      </div>
    </div>
  );
}
