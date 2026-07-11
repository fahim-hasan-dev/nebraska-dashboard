import { z } from "zod";

export const resultsSchema = z.object({
  event: z.string().min(1, "Please select an event"),
  class: z.string().min(1, "Please select a competitor class"),
  driver: z.string().min(1, "Please select a driver"),
  distance: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ required_error: "Distance is required" })
      .positive("Distance must be a positive value")
  ),
  point: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ required_error: "Points are required" })
      .min(0, "Points cannot be negative")
  ),
});

export type ResultsFormValues = z.infer<typeof resultsSchema>;
