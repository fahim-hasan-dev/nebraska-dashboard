"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AuthWrapper } from "../AuthWrapper";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    toast.loading("Sending...", {
      id: "forgot-password-toast",
    });
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
    };
    console.log(payload);

    try {
      //! perform your api call here...

      toast.success("OTP sent to your email", { id: "forgot-password-toast" });
      router.push(`/otp-verify?email=${payload.email}`);
    } catch (error: unknown) {
      console.log("Error fetching data:", error);
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
              Send Reset Link
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

