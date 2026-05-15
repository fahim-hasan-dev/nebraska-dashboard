"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, CircleMinus, Pen, Trash2 } from "lucide-react";

interface FaqType {
  id: number;
  question: string;
  answer: string;
}

interface FaqViewProps {
  faqs: {
    fan: FaqType[];
    driver: FaqType[];
  };
}

export default function FaqView({ faqs }: FaqViewProps) {
  const [activeTab, setActiveTab] = useState<"fan" | "driver">("fan");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentFaqs = activeTab === "fan" ? faqs.fan : faqs.driver;

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto space-y-8">
      {/* Container */}
      <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
        
        {/* Tabs */}
        <div className="flex bg-[#F1F3F5] p-1 rounded-md w-fit mb-8">
          <button
            onClick={() => setActiveTab("fan")}
            className={`px-10 py-2 text-sm font-medium rounded-sm transition-colors ${
              activeTab === "fan"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fan
          </button>
          <button
            onClick={() => setActiveTab("driver")}
            className={`px-10 py-2 text-sm font-medium rounded-sm transition-colors ${
              activeTab === "driver"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Driver
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-8">
          <Accordion type="single" collapsible className="w-full">
            {currentFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-b py-2 group">
                <AccordionTrigger className="hover:no-underline [&>svg:last-child]:hidden py-4">
                  <div className="flex items-center gap-6 w-full text-left">
                    <span className="text-xl font-bold text-gray-700 min-w-[32px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold text-gray-800 flex-1">
                      {faq.question}
                    </span>
                    {/* Custom Icons for open/close state */}
                    <div className="text-gray-500 shrink-0">
                      <CirclePlus className="h-6 w-6 group-data-[state=open]:hidden stroke-[1.5]" />
                      <CircleMinus className="h-6 w-6 hidden group-data-[state=open]:block stroke-[1.5]" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 pl-14 pr-12 text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
                <div className="flex items-center gap-4 pl-14 pb-4">
                  <button className="text-gray-500 hover:text-gray-900 transition-colors">
                    <Pen className="h-4 w-4" />
                  </button>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Add New FAQ Button */}
        <div className="flex justify-end">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md px-6">
                Add New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl overflow-hidden">
              <div className="p-8">
                <DialogHeader className="mb-6 relative">
                  <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                    Add New FAQ
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-gray-600 font-medium">Question</Label>
                    <Input
                      id="question"
                      placeholder="Enter your question"
                      className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-gray-600 font-medium">Answer</Label>
                    <Input
                      id="answer"
                      placeholder="Enter your answer"
                      className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                    />
                  </div>
                  <Button className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4">
                    Add
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
