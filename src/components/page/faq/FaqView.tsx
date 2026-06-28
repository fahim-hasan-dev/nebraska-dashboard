"use client";

import React, { useState, useEffect } from "react";
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
import { CirclePlus, CircleMinus, Pen, Trash2, Loader2, Info } from "lucide-react";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";

interface FaqType {
  id?: number;
  _id?: string;
  question: string;
  answer: string;
  type?: "fan" | "driver";
}

interface FaqViewProps {
  faqs: {
    fan: FaqType[];
    driver: FaqType[];
  };
}

export default function FaqView({ faqs }: FaqViewProps) {
  const [activeTab, setActiveTab] = useState<"fan" | "driver">("fan");
  const [faqList, setFaqList] = useState<FaqType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqType | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Fetch FAQ from backend (utilizing the new backend query-parameter filtering by type)
  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await myFetch(`/public/faq/all?type=${activeTab}`, {
        method: "GET",
        cache: "no-store",
      });
      if (res.success && res.data) {
        setFaqList(res.data);
      } else {
        // Fail-safe to mock data if API call returns success but empty or no data
        setFaqList([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [activeTab]);

  // If API hasn't loaded any data yet (or database is empty for this tab), we gracefully show mock data.
  const hasDbData = faqList.length > 0;
  const currentFaqs = hasDbData
    ? faqList
    : activeTab === "fan"
    ? faqs.fan
    : faqs.driver;

  // Add FAQ
  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Please fill in both the question and answer");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Adding FAQ...", { id: "faq-action" });

    try {
      const res = await myFetch("/public/faq", {
        method: "POST",
        body: {
          question: newQuestion,
          answer: newAnswer,
          type: activeTab,
        },
      });

      if (res.success) {
        toast.success("FAQ added successfully!", { id: "faq-action" });
        setNewQuestion("");
        setNewAnswer("");
        setIsAddModalOpen(false);
        fetchFaqs();
      } else {
        toast.error(res.message || "Failed to add FAQ", { id: "faq-action" });
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("An unexpected error occurred while adding FAQ", { id: "faq-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (faq: FaqType) => {
    setEditingFaq(faq);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setIsEditModalOpen(true);
  };

  // Edit FAQ
  const handleEditFaq = async () => {
    if (!editingFaq) return;
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast.error("Please fill in both the question and answer");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Updating FAQ...", { id: "faq-action" });

    const faqId = editingFaq._id;
    if (!faqId) {
      // If we are editing static mock data (does not have an _id in DB yet)
      toast.error("Static mock FAQs cannot be updated on server. Please add a new FAQ first.", { id: "faq-action" });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await myFetch(`/public/faq/${faqId}`, {
        method: "PATCH",
        body: {
          question: editQuestion,
          answer: editAnswer,
        },
      });

      if (res.success) {
        toast.success("FAQ updated successfully!", { id: "faq-action" });
        setIsEditModalOpen(false);
        setEditingFaq(null);
        fetchFaqs();
      } else {
        toast.error(res.message || "Failed to update FAQ", { id: "faq-action" });
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("An unexpected error occurred while updating FAQ", { id: "faq-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faqId: string): Promise<void> => {
    toast.loading("Deleting FAQ...", { id: "faq-action" });

    try {
      const res = await myFetch(`/public/faq/${faqId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("FAQ deleted successfully!", { id: "faq-action" });
        fetchFaqs();
      } else {
        toast.error(res.message || "Failed to delete FAQ", { id: "faq-action" });
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("An unexpected error occurred while deleting FAQ", { id: "faq-action" });
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto space-y-8">
      {/* Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        
        {/* Header section with add button inline */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          {/* Tabs */}
          <div className="flex bg-[#F1F3F5] p-1 rounded-md w-fit">
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

          {/* Add New FAQ Trigger Button */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md px-6 flex items-center gap-2">
                Add New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl overflow-hidden">
              <div className="p-8">
                <DialogHeader className="mb-6 relative">
                  <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                    Add New FAQ ({activeTab === "fan" ? "Fan" : "Driver"})
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-gray-600 font-medium">Question</Label>
                    <Input
                      id="question"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter your question"
                      className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-gray-600 font-medium">Answer</Label>
                    <Input
                      id="answer"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={handleAddFaq}
                    disabled={isSubmitting}
                    className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add FAQ
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-sm font-medium">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              Loading FAQs...
            </div>
          ) : currentFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No FAQs found under this category. Click &quot;Add New FAQ&quot; to create one.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {currentFaqs.map((faq, index) => (
                <AccordionItem key={faq._id || faq.id} value={`item-${faq._id || faq.id}`} className="border-b py-2 group">
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
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      title="Edit FAQ"
                      className="text-gray-500 hover:text-gray-900 transition-colors p-1"
                    >
                      <Pen className="h-4 w-4" />
                    </button>
                    {faq._id && (
                      <DeleteModal
                        itemId={faq._id}
                        triggerBtn={
                          <button
                            title="Delete FAQ"
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        }
                        title="Delete FAQ"
                        description="Are you sure you want to permanently delete this FAQ? This action cannot be undone."
                        actionBtnText="Delete"
                        action={handleDeleteFaq}
                      />
                    )}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      {/* Edit FAQ Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl overflow-hidden">
          <div className="p-8">
            <DialogHeader className="mb-6 relative">
              <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                Edit FAQ
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-question" className="text-gray-600 font-medium">Question</Label>
                <Input
                  id="edit-question"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  placeholder="Enter your question"
                  className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-answer" className="text-gray-600 font-medium">Answer</Label>
                <Input
                  id="edit-answer"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                />
              </div>
              <Button
                onClick={handleEditFaq}
                disabled={isSubmitting}
                className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
