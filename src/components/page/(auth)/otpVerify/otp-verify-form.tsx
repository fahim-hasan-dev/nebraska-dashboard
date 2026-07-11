"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AuthWrapper } from "../AuthWrapper";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { myFetch } from "@/utils/myFetch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  oneTimeCode: z.string().min(6, {
    message: "Your one-time password must be 6 digits.",
  }),
});

export function OtpVerifyForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const [timeLeft, setTimeLeft] = useState(56);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oneTimeCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    toast.loading("Verifying...", {
      id: "verify-otp-toast",
    });

    try {
      // Perform the API call to verify the OTP code
      const response = await myFetch("/auth/verify-account", {
        method: "POST",
        body: {
          oneTimeCode: values.oneTimeCode,
          email,
        },
      });

      if (response.success) {
        // Retrieve the token from response (to authorize reset-password page)
        const token = response.data?.token || response.data?.accessToken || response.data?.data?.token || "demoAuthToken";
        
        toast.success(response.message || "OTP verified successfully", { id: "verify-otp-toast" });
        router.push(`/reset-password?token=${token}`);
      } else {
        toast.error(response.message || response.error || "Failed to verify OTP", { id: "verify-otp-toast" });
      }
    } catch (error: unknown) {
      console.error("Error verifying OTP:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: "verify-otp-toast" });
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    toast.loading("Sending...", {
      id: "resend-otp-toast",
    });
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });

      if (res?.success) {
        toast.success(res?.message as string, { id: "resend-otp-toast" });
        setTimeLeft(60);
      } else {
        toast.error(res?.message || "Failed to resend", {
          id: "resend-otp-toast",
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <AuthWrapper 
      title="Verify Reset Password" 
      subtitle="Enter the code sent to your email to reset your password."
    >
      <div className={cn("space-y-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oneTimeCode"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot index={0} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                        <InputOTPSlot index={1} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                        <InputOTPSlot index={2} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                        <InputOTPSlot index={3} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                        <InputOTPSlot index={4} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                        <InputOTPSlot index={5} className="w-16 h-16 text-2xl font-bold border-[#E5E7EB] rounded-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold text-[16px] rounded-lg transition-all shadow-sm active:scale-[0.98]"
              >
                Verify Code
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
          </form>
        </Form>

        <div className="text-center">
          <p className="text-[14px] text-gray-500">
            {timeLeft > 0 ? (
              <>Resend code in <span className="font-medium text-gray-900">{formatTime(timeLeft)}</span></>
            ) : (
              <button 
                onClick={handleResend}
                className="text-blue-600 font-medium hover:underline transition-all"
              >
                Resend code
              </button>
            )}
          </p>
        </div>
      </div>
    </AuthWrapper>
  );
}

