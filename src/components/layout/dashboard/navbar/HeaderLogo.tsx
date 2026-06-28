"use client";

import logoPng from "@/assets/images/logo.png";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { myFetch } from "@/utils/myFetch";
import { getImageUrl } from "@/utils/imageUrl";

export function HeaderLogo() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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
        console.error("Error loading logo in header:", err);
      }
    };
    fetchLogo();
  }, [pathname]);

  if (!mounted) {
    return <div className="w-[90px] h-[90px] shrink-0" />;
  }

  return (
    <img
      src={logoUrl ? getImageUrl(logoUrl) : logoPng.src}
      alt="logo"
      className="w-[90px] h-[90px] object-contain shrink-0"
    />
  );
}
