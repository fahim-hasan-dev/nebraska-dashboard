"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AuthWrapper } from "../AuthWrapper";
import { myFetch } from "@/utils/myFetch";

// zod schema for form validation
const FormSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password not matched",
    path: ["confirmPassword"], // Error will be shown on the confirmPassword field
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  // define form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // handle form submit
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    toast.loading("Reseting...", {
      id: "reset-password-toast",
    });

    try {
      // Perform the API call using myFetch
      const response = await myFetch(`/auth/reset-password?token=${token}`, {
        method: "POST",
        body: {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });

      if (response.success) {
        toast.success(response.message || "Reseted successfully", {
          id: "reset-password-toast",
        });
        router.push(`/login`);
      } else {
        toast.error(response.message || response.error || "Failed to reset password", {
          id: "reset-password-toast",
        });
      }
    } catch (error: unknown) {
      console.error("Error resetting password:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        id: "reset-password-toast",
      });
    }
  };

  return (
    <AuthWrapper title="Set New Password" subtitle="Create a new password for your account.">
      <div className={cn("space-y-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* new password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password" className="text-[14px] font-medium text-[#374151]">Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isPasswordVisible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* confirm new password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="conf-password" className="text-[14px] font-medium text-[#374151]">Confirm Password</Label>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="conf-password"
                        type={isConfPasswordVisible ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setIsConfPasswordVisible(!isConfPasswordVisible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {isConfPasswordVisible ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold text-[16px] rounded-lg transition-all shadow-sm active:scale-[0.98]"
              >
                Confirm
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
      </div>
    </AuthWrapper>
  );
}

