/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertCircle, Clock, Send, Trash2, Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { myFetch } from "@/utils/myFetch";
import toast from "react-hot-toast";
import DeleteModal from "@/components/modals/DeleteModal";

export default function MessagesView({ initialMessages }: { initialMessages: any[] }) {
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"driver" | "fan">("driver");

  // Modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [modalUserType, setModalUserType] = useState<"driver" | "fan">("driver");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialMessages to state
  useEffect(() => {
    if (initialMessages) {
      if (Array.isArray(initialMessages)) {
        setMessagesList(initialMessages);
      } else if ((initialMessages as any).data && Array.isArray((initialMessages as any).data)) {
        setMessagesList((initialMessages as any).data);
      }
    }
  }, [initialMessages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await myFetch("/message?limit=100", {
        method: "GET",
        cache: "no-store",
      });
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setMessagesList(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setMessagesList(res.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages from server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Posting message...", { id: "message-action" });

    try {
      const res = await myFetch("/message/create", {
        method: "POST",
        body: {
          title: newTitle.trim(),
          message: newMessage.trim(),
          userType: modalUserType,
        },
      });

      if (res.success) {
        toast.success("Message posted successfully!", { id: "message-action" });
        setNewTitle("");
        setNewMessage("");
        setModalUserType("driver");
        setIsAddModalOpen(false);
        fetchMessages();
      } else {
        toast.error(res.message || "Failed to post message", { id: "message-action" });
      }
    } catch (error) {
      console.error("Error posting message:", error);
      toast.error("An error occurred while posting message", { id: "message-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string): Promise<void> => {
    toast.loading("Deleting message...", { id: "message-action" });

    try {
      const res = await myFetch(`/message/${messageId}`, {
        method: "DELETE",
      });

      if (res.success) {
        toast.success("Message deleted successfully!", { id: "message-action" });
        fetchMessages();
      } else {
        toast.error(res.message || "Failed to delete message", { id: "message-action" });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("An error occurred while deleting message", { id: "message-action" });
    }
  };

  // Safe date formatter: May 21 at 09:12 PM
  const formatMessageDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      
      const optionsDate: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
      
      const formattedDate = date.toLocaleDateString("en-US", optionsDate);
      const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
      
      return `${formattedDate} at ${formattedTime}`;
    } catch {
      return dateStr;
    }
  };

  // Client-side filtering based on selected tab
  const filteredMessages = messagesList.filter((msg) => {
    return msg.userType === activeTab;
  });

  return (
    <div className="flex flex-col w-full h-full max-w-[1000px] mx-auto pb-20 px-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Board</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and dispatch broad alerts for drivers and fans.</p>
        </div>
        
        {/* Create Message Button Trigger */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Create Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 border-0 rounded-2xl overflow-hidden bg-white shadow-xl">
            <div className="p-8">
              <DialogHeader className="mb-6 relative">
                <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                  Create New Message
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* User Type Toggle */}
                <div className="space-y-2">
                  <Label className="text-gray-600 font-medium block">Send To</Label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="modal-userType"
                        value="driver"
                        checked={modalUserType === "driver"}
                        onChange={() => setModalUserType("driver")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Drivers</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="modal-userType"
                        value="fan"
                        checked={modalUserType === "fan"}
                        onChange={() => setModalUserType("fan")}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Fans</span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-600 font-medium">Title</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Weather Delay, Schedule Change"
                    className="border-gray-200 focus-visible:ring-[#3B82F6] h-12 rounded-lg"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-600 font-medium">Message</Label>
                  <textarea
                    id="message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    rows={4}
                    className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6] resize-none"
                  />
                </div>

                <Button
                  onClick={handleCreateMessage}
                  disabled={isSubmitting}
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white h-12 rounded-lg text-base mt-4 flex items-center justify-center gap-2 font-semibold"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Send className="w-4 h-4" />
                  Post Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#F1F3F5] p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab("driver")}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "driver"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          For Drivers
        </button>
        <button
          onClick={() => setActiveTab("fan")}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "fan"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          For Fans
        </button>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-sm font-medium bg-white border border-gray-200 rounded-xl shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No messages found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {`There are no messages posted for ${activeTab === "driver" ? "drivers" : "fans"} yet.`}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isDriver = msg.userType === "driver";
            return (
              <div
                key={msg._id || msg.id}
                className={`border rounded-xl p-5 flex gap-4 transition-all relative ${
                  isDriver
                    ? "bg-[#f0f7ff] border-blue-100 hover:border-blue-200"
                    : "bg-[#fcf8ff] border-purple-100 hover:border-purple-200"
                }`}
              >
                <div className="pt-1">
                  <AlertCircle className={`w-5 h-5 ${isDriver ? "text-blue-500" : "text-purple-500"}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-bold text-base ${isDriver ? "text-blue-800" : "text-purple-800"}`}>
                      {msg.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                        isDriver
                          ? "bg-blue-100/80 text-blue-800"
                          : "bg-purple-100/80 text-purple-800"
                      }`}
                    >
                      {isDriver ? "Drivers" : "Fans"}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDriver ? "text-blue-700/90" : "text-purple-700/90"}`}>
                    {msg.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{msg.createdAt ? formatMessageDate(msg.createdAt) : msg.time || "Just now"}</span>
                  </div>
                </div>
                
                {/* Delete Trigger */}
                {msg._id && (
                  <div className="flex items-start self-start pt-1 shrink-0">
                    <DeleteModal
                      itemId={msg._id}
                      triggerBtn={
                        <button
                          title="Delete Message"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isDriver
                              ? "text-blue-400 border-blue-200/50 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50"
                              : "text-purple-400 border-purple-200/50 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50"
                          }`}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      }
                      title="Delete Message"
                      description="Are you sure you want to permanently delete this message? This action cannot be undone."
                      actionBtnText="Delete"
                      action={handleDeleteMessage}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
