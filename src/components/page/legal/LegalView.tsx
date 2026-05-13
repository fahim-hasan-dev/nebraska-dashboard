"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const defaultTerms = `### 1. Introduction
Welcome to Modulix Market. By accessing our platform, you agree to these terms. Please read them carefully.

### 2. Service Usage
Our platform connects suppliers with businesses for bulk purchasing. You agree to use the service only for lawful purposes and in accordance with these Terms.
* You must provide accurate account information.
* You are responsible for maintaining the confidentiality of your account.
* Unauthorized use of the platform is strictly prohibited.

### 3. Orders & Payments
All orders are subject to acceptance and availability. Prices are subject to change without notice. We reserve the right to refuse service to anyone.

### 4. Intellectual Property
The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.`;

const defaultPrivacy = `### 1. Information Collection
We collect information to provide better services to all our users. We may collect personal information such as your name, email address, and payment details.

### 2. How We Use Information
We use the information we collect to provide, maintain, protect and improve our services, to develop new ones, and to protect our platform and our users.

### 3. Information Sharing
We do not share personal information with companies, organizations and individuals outside of our company unless one of the following circumstances applies...`;

export default function LegalView() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [termsContent, setTermsContent] = useState(defaultTerms);
  const [privacyContent, setPrivacyContent] = useState(defaultPrivacy);

  const handleReset = () => {
    if (activeTab === "terms") {
      setTermsContent(defaultTerms);
    } else {
      setPrivacyContent(defaultPrivacy);
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
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === "terms"
                ? "text-blue-600 border-b-2 border-blue-600"
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
                ? "text-blue-600 border-b-2 border-blue-600"
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
          {/* Tip Banner */}
          <div className="bg-[#fffdf5] border border-amber-200/60 rounded-md p-3 flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-700">
              <span className="font-semibold text-amber-800">Tip:</span> You can use Markdown-like syntax for headers (### Header) and bullet points (* Item). Currently editing in <span className="font-bold">Plain Text</span> mode.
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={activeTab === "terms" ? termsContent : privacyContent}
            onChange={(e) =>
              activeTab === "terms"
                ? setTermsContent(e.target.value)
                : setPrivacyContent(e.target.value)
            }
            className="w-full min-h-[400px] bg-gray-50/50 border border-gray-100 rounded-lg p-6 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            spellCheck="false"
          />

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
            <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-2 rounded-md font-medium text-sm transition-colors w-full sm:w-auto">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
