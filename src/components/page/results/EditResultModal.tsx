"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trophy } from "lucide-react";
import toast from "react-hot-toast";

import BaseModal from "@/components/ui/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { myFetch } from "@/utils/myFetch";
import { resultsSchema, ResultsFormValues } from "@/schemas/formSchemas/resultsSchema";

interface EditResultModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result: any;
  onSuccess: () => void;
}

export default function EditResultModal({
  isOpen,
  onOpenChange,
  result,
  onSuccess,
}: EditResultModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [driverName, setDriverName] = useState("");

  const form = useForm<ResultsFormValues>({
    resolver: zodResolver(resultsSchema),
    defaultValues: {
      event: "",
      class: "",
      driver: "",
      distance: 0,
      point: 0,
    },
  });


  // Sync edit modal forms values when the active row changes
  useEffect(() => {
    if (result) {
      const eventId = result.event?._id || result.event?.id || result.event || "";
      const driverId = result.driver?._id || result.driver?.id || result.driver || "";
      
      form.reset({
        event: eventId,
        class: result.class || "",
        driver: driverId,
        distance: result.distance || 0,
        point: result.point ?? 0,
      });

      setSelectedEvent(result.event);
      setDriverName(
        result.driver?.fullName 
          ? `${result.driver.fullName}${result.driver.tractorName && result.driver.tractorName.length > 0 ? ` (${result.driver.tractorName.join(", ")})` : ""}` 
          : "Unknown Driver"
      );
    }
  }, [result, form]);

  // Load full event details if selectedEvent is set to a string ID
  useEffect(() => {
    if (typeof selectedEvent === "string" && selectedEvent !== "") {
      const fetchEventDetails = async () => {
        try {
          const res = await myFetch(`/event/${selectedEvent}`);
          if (res.success && res.data) {
            setSelectedEvent(res.data);
          }
        } catch (err) {
          console.error("Error fetching event details in EditResultModal:", err);
        }
      };
      fetchEventDetails();
    }
  }, [selectedEvent]);

  const onSubmit = async (values: ResultsFormValues) => {
    setIsSubmitting(true);
    const toastId = "result-action";
    toast.loading("Updating result...", { id: toastId });

    try {
      const res = await myFetch(`/result/${result?._id || result?.id}`, {
        method: "PATCH",
        body: {
          event: values.event,
          class: values.class,
          driver: values.driver,
          distance: Number(values.distance),
          point: Number(values.point),
        },
      });

      if (res.success) {
        toast.success("Result updated successfully!", { id: toastId });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Failed to update result", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("An error occurred while updating result", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={
        <>
          <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
          Update Competitor Result
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Event Select */}
          <FormField
            control={form.control}
            name="event"
            render={() => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-600 font-medium">Event</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={selectedEvent?.name || (result?.event && typeof result.event === "object" ? result.event.name : "Loading...")}
                    disabled={true}
                    className="h-12 border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed font-semibold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class Selector */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-600 font-medium">Competitor Class</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value || ""}
                    disabled={true}
                    className="h-12 border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed font-semibold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Readonly Driver Info */}
          <div className="space-y-1.5">
            <Label htmlFor="editDriver" className="text-gray-600 font-medium">Driver</Label>
            <Input
              id="editDriver"
              type="text"
              value={driverName}
              disabled={true}
              className="h-12 border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed font-semibold"
            />
          </div>

          {/* Distance Field */}
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-600 font-medium">Distance (ft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 250.50"
                    className="h-12 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Points Field */}
          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-gray-600 font-medium">Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 50"
                    className="h-12 border-gray-200 focus-visible:ring-[#3b82f6]/50 rounded-lg text-sm"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Result
          </Button>
        </form>
      </Form>
    </BaseModal>
  );
}
