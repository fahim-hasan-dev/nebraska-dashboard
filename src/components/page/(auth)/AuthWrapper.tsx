"use client";

import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { ReactNode } from "react";


interface AuthWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto py-10 px-6">
      <div className="flex flex-col items-center w-full mb-10">
        <figure className="mb-6">
          <Image 
            src={Logo} 
            alt="Nebraska Bush Pullers Logo" 
            width={300} 
            height={150} 
            className="w-auto h-auto max-w-[320px]"
            priority
          />
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

