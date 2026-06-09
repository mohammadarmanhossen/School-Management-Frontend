"use client";

import { useState, useEffect } from "react";
import { useNoticeStore } from "@/store";
import { toast } from "sonner";
import { 
  Trash2, 
  Edit2, 
  X, 
  Megaphone, 
  Send, 
  Clock, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function TeacherNoticePage() {
  const notices = useNoticeStore((state) => state.notices);
  const addNotice = useNoticeStore((state) => state.addNotice);
  const updateNotice = useNoticeStore((state) => state.updateNotice);
  const deleteNotice = useNoticeStore((state) => state.deleteNotice);

  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (editingId) {
      updateNotice(editingId, {
        title,
        content: message,
      });
      toast.success("Notice updated!");
      setEditingId(null);
    } else {
      addNotice({
        title,
        content: message,
        priority: "medium",
        status: "published",
        targetRoles: ["student"],
        publishDate: new Date().toISOString().split("T")[0],
      }, "Teacher");
      toast.success("Notice published!");
    }

    setTitle("");
    setMessage("");
  };

  const handleEdit = (id: string, currentTitle: string, currentMessage: string) => {
    setEditingId(id);
    setTitle(currentTitle);
    setMessage(currentMessage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      deleteNotice(id);
      toast.success("Notice deleted");
      if (editingId === id) {
        handleCancel();
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setMessage("");
  };

  if (!mounted) return null;

  const displayNotices = [...notices].reverse();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/20 blur-2xl rounded-full -z-10" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20 shadow-sm">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white bg-clip-text">
              Class Announcements
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Publish and manage important notices for your students instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CREATE / EDIT FORM */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all duration-300">
            {/* Form Header */}
            <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors ${editingId ? 'bg-amber-50/50 dark:bg-amber-500/5' : 'bg-slate-50/50 dark:bg-slate-900/50'}`}>
              <div className="flex items-center gap-2">
                {editingId ? (
                  <Edit2 className="h-4 w-4 text-amber-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                )}
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  {editingId ? "Edit Notice" : "New Notice"}
                </h2>
              </div>
              {editingId && (
                <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Form Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  Notice Title
                </label>
                <Input
                  placeholder="e.g., Upcoming Math Test"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/30 transition-all rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  Message Content
                </label>
                <Textarea
                  placeholder="Write the detailed announcement here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[140px] resize-y bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/30 transition-all rounded-xl leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSubmit} 
                  className={`w-full h-11 rounded-xl font-medium shadow-md transition-all ${
                    editingId 
                      ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white" 
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 text-white"
                  }`}
                >
                  {editingId ? (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Notice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NOTICE LIST */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-slate-400" />
              Published Notices
            </h3>
            <Badge variant="secondary" className="rounded-full px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {displayNotices.length} Total
            </Badge>
          </div>
          
          {displayNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-50 dark:ring-slate-900/50">
                <Megaphone className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">No notices yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                Create your first announcement using the form to notify your students.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {displayNotices.map((n) => (
                <div 
                  key={n.id} 
                  className={`group relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-none hover:-translate-y-0.5 ${
                    editingId === n.id 
                      ? 'border-amber-400 dark:border-amber-500/50 ring-4 ring-amber-500/10 shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Left Icon Area (Hidden on very small screens) */}
                    <div className="hidden sm:flex shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                        editingId === n.id 
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' 
                          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20'
                      }`}>
                        <Megaphone className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 truncate pr-4">
                            {n.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              <Clock className="h-3 w-3" />
                              {new Date(n.publishDate).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              By <span className="text-slate-700 dark:text-slate-300">{n.author}</span>
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(n.id, n.title, n.content)}
                            className="h-8 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5 sm:mr-1.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(n.id)}
                            className="h-8 w-8 sm:w-auto sm:px-3 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:mr-1.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {n.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
