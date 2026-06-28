"use client";

import Logo from "@/assets/images/logo.png";
import { ReactNode, useState, useEffect } from "react";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";

interface AuthWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("dashboard_logo_url") || "";
      setLogoUrl(cached);
    }

    const fetchLogo = async () => {
      try {
        const res = await myFetch("/public/logo", { method: "GET", cache: "no-store" });
        if (res.success && res.data && res.data.content) {
          const newUrl = res.data.content;
          setLogoUrl(newUrl);
          localStorage.setItem("dashboard_logo_url", newUrl);
        } else if (res.success) {
          setLogoUrl("");
          localStorage.removeItem("dashboard_logo_url");
        }
      } catch (err) {
        console.error("Error fetching logo in auth wrapper:", err);
      }
    };
    fetchLogo();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto py-10 px-6">
      <div className="flex flex-col items-center w-full mb-10">
        <figure className="mb-6 h-[150px] flex items-center justify-center">
          {mounted ? (
            <img 
              src={logoUrl ? getImageUrl(logoUrl) : Logo.src} 
              alt="Nebraska Bush Pullers Logo" 
              className="w-auto h-auto max-w-[320px] max-h-[150px] object-contain"
            />
          ) : (
            <div className="w-[320px] h-[150px]" />
          )}
        </figure>
        <h1 className="text-[32px] font-bold text-[#1F2937] text-center leading-tight">
          {title}
        </h1>
        <p className="text-[16px] text-[#6B7280] text-center mt-2">
          {subtitle}
        </p>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

