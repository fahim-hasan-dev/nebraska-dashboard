"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

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

const defaultPrivacy = `<h3>1. Information Collection</h3>
<p>We collect information to provide better services to all our users. We may collect personal information such as your name, email address, and phone number.</p>
<h3>2. How We Use Information</h3>
<p>We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect our platform and our users.</p>
<h3>3. Information Sharing</h3>
<p>We do not share personal information with companies, organizations and individuals outside of our company unless one of the following circumstances applies...</p>`;

export default function LegalView() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Memoized Jodit configuration to prevent cursor jumping/re-renders and set native height
  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Start typing...",
    height: 400,
    width: "auto",
  }), []);

  // Fetch legal content from backend on mount
  useEffect(() => {
    const fetchLegalData = async () => {
      setIsLoading(true);
      try {
        // Fetch Terms and Conditions
        const termsRes = await myFetch("/public/terms-and-condition", {
          method: "GET",
          cache: "no-store",
        });
        if (termsRes.success && termsRes.data) {
          setTermsContent(termsRes.data.content || defaultTerms);
        } else {
          setTermsContent(defaultTerms);
        }

        // Fetch Privacy Policy
        const privacyRes = await myFetch("/public/privacy-policy", {
          method: "GET",
          cache: "no-store",
        });
        if (privacyRes.success && privacyRes.data) {
          setPrivacyContent(privacyRes.data.content || defaultPrivacy);
        } else {
          setPrivacyContent(defaultPrivacy);
        }
      } catch (err) {
        console.error("Error fetching legal data:", err);
        toast.error("Failed to load legal content from server");
        setTermsContent(defaultTerms);
        setPrivacyContent(defaultPrivacy);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegalData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const type = activeTab === "terms" ? "terms-and-condition" : "privacy-policy";
    const content = activeTab === "terms" ? termsContent : privacyContent;

    toast.loading("Saving content...", { id: "save-legal" });

    try {
      const res = await myFetch("/public", {
        method: "POST",
        body: { type, content },
      });

      if (res.success) {
        toast.success(
          `${activeTab === "terms" ? "Terms & Conditions" : "Privacy Policy"} saved successfully!`,
          { id: "save-legal" }
        );
      } else {
        toast.error(res.message || "Failed to save content", { id: "save-legal" });
      }
    } catch (err) {
      console.error("Error saving legal content:", err);
      toast.error("An unexpected error occurred while saving", { id: "save-legal" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Legal Content Management
        </h1>
        <p className="text-sm text-gray-500">
          Edit the legal documents displayed to your users.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "terms"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </span>
              Terms & Conditions
            </span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "privacy"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/5"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </span>
              Privacy Policy
            </span>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Editor Container */}
          <div className="min-h-[400px] border border-gray-100 rounded-lg overflow-hidden bg-gray-50/10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 text-sm font-medium bg-white">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                Loading content...
              </div>
            ) : activeTab === "terms" ? (
              <JoditEditor
                value={termsContent}
                config={config}
                onBlur={(newContent) => setTermsContent(newContent)}
              />
            ) : (
              <JoditEditor
                value={privacyContent}
                config={config}
                onBlur={(newContent) => setPrivacyContent(newContent)}
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 mt-2">
            <button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="bg-[#3b82f6] hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-2 rounded-md font-semibold text-sm transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
