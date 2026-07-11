"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Loader2, Trophy } from "lucide-react";
import toast from "react-hot-toast";

import BaseModal from "@/components/ui/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SearchableInfiniteSelect from "@/components/ui/SearchableInfiniteSelect";
import { myFetch } from "@/utils/myFetch";
import { resultsSchema, ResultsFormValues } from "@/schemas/formSchemas/resultsSchema";

interface AddResultModalProps {
  onSuccess: (eventId: string, className: string, selectedEvent: any) => void;
}

export default function AddResultModal({ onSuccess }: AddResultModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Initialize form with Zod schema validation
  const form = useForm<ResultsFormValues>({
    resolver: zodResolver(resultsSchema),
    defaultValues: {
      event: "",
      class: "",
      driver: "",
      distance: "" as any, // prefilled empty or typed
      point: "" as any,
    },
  });

  const watchEvent = form.watch("event");
  const watchClass = form.watch("class");

  const onSubmit = async (values: ResultsFormValues) => {
    setIsSubmitting(true);
    const toastId = "result-action";
    toast.loading("Recording result...", { id: toastId });

    try {
      const res = await myFetch("/result/create", {
        method: "POST",
        body: {
          event: values.event,
          class: values.class,
          driver: values.driver,
          distance: Number(values.distance),
          point: Number(values.point),
        },
      });

      if (res.success) {
        toast.success("Result recorded successfully!", { id: toastId });
        form.reset();
        setSelectedEvent(null);
        setIsOpen(false);
        onSuccess(values.event, values.class, selectedEvent);
      } else {
        toast.error(res.message || "Failed to record result", { id: toastId });
      }
    } catch (error) {
      console.error("Error creating result:", error);
      toast.error("An error occurred while recording result", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setSelectedEvent(null);
    }
  };

  const availableClasses = selectedEvent?.class || [];

  return (
    <>
      <Button
        onClick={() => handleOpenChange(true)}
        className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Add New Result
      </Button>

      <BaseModal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        title={
          <>
            <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
            Record Competitor Result
          </>
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Event Select */}
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-600 font-medium">Event</FormLabel>
                  <FormControl>
                    <SearchableInfiniteSelect
                      endpoint="/event"
                      fields="_id,name,class"
                      placeholder="Select Event"
                      value={field.value}
                      onChange={(value, event) => {
                        field.onChange(value);
                        setSelectedEvent(event);
                        form.setValue("class", ""); // Reset dependent class field
                        form.setValue("driver", "");
                      }}
                      displayValue={(evt) => evt.name}
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
                  <div className="relative">
                    <select
                      id="editClass"
                      value={field.value}
                      disabled={!watchEvent}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("driver", "");
                      }}
                      className="flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] cursor-pointer transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!watchEvent ? "Please select event first" : "Select Class"}
                      </option>
                      {availableClasses.map((cls: any) => (
                        <option key={cls.name || cls} value={cls.name || cls}>
                          {cls.name || cls}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driver Select */}
            <FormField
              control={form.control}
              name="driver"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-gray-600 font-medium">Driver</FormLabel>
                  <FormControl>
                    <SearchableInfiniteSelect
                      endpoint="/user/driver"
                      fields="_id,fullName,tractorName"
                      placeholder="Select Driver"
                      value={field.value}
                      disabled={!watchClass}
                      onChange={(value) => field.onChange(value)}
                      displayValue={(driver) => {
                        const tractors = driver.tractorName && driver.tractorName.length > 0
                          ? ` (${driver.tractorName.join(", ")})`
                          : "";
                        return `${driver.fullName}${tractors}`;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Distance */}
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

            {/* Points */}
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
              Record Result
            </Button>
          </form>
        </Form>
      </BaseModal>
    </>
  );
}
