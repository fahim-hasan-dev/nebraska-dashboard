import { z } from "zod";

export const adminSchema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address").trim().toLowerCase(),
  phone: z.string().min(1, "Phone number is required").trim(),
});

export type AdminFormValues = z.infer<typeof adminSchema>;
