"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AuthWrapper } from "../AuthWrapper";
import { myFetch } from "@/utils/myFetch";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.loading("Sending...", {
      id: "forgot-password-toast",
    });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      // Perform the API call to send OTP to the email
      const response = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });

      if (response.success) {
        toast.success(response.message || "OTP sent to your email", { id: "forgot-password-toast" });
        router.push(`/otp-verify?email=${email}`);
      } else {
        toast.error(response.message || response.error || "Failed to send reset link", { id: "forgot-password-toast" });
      }
    } catch (error: unknown) {
      console.error("Error sending OTP:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: "forgot-password-toast" });
    }
  };

  return (
    <AuthWrapper
      title="Reset Password"
      subtitle="Enter the email address associated with your account."
    >
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

          {/* Action Buttons */}
          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold text-[16px] rounded-lg transition-all shadow-sm active:scale-[0.98]"
            >
              Send OTP
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full h-12 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#374151] font-medium text-[16px] rounded-lg transition-all shadow-sm"
            >
              Back to Sign in
            </Button>
          </div>
        </div>
      </form>
    </AuthWrapper>
  );
}

