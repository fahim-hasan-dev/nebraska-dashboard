"use client";

import { AuthWrapper } from "../AuthWrapper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    toast.loading("Logging in...", {
      id: "login",
    });
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    console.log(payload);

    try {
      //! perform your api call here..

      toast.success("Login successful", { id: "login" });
      router.push(redirect || "/");
    } catch (error: unknown) {
      console.log("Error fetching data:", error);
    }
  };

  return (
    <AuthWrapper title="Welcome Back" subtitle="Login to your account">
      <form onSubmit={handleSubmit} className={cn("space-y-6", className)} {...props}>
        <div className="space-y-5">
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[14px] font-medium text-[#374151]">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your full name"
              required
              className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[14px] font-medium text-[#374151]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your full name"
                required
                className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isPasswordVisible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <Label 
                htmlFor="remember" 
                className="text-[14px] font-medium text-[#111827] cursor-pointer select-none"
              >
                Remember Password
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-[14px] font-medium text-[#111827] hover:text-blue-600 transition-colors underline underline-offset-4"
            >
              Forgot Password
            </Link>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold text-[16px] rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            Login
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
}

