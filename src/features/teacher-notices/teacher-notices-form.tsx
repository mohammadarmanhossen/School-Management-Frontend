"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Save, Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNoticeStore } from "@/store/notice-store";
import { NoticeFormData } from "@/schemas";
import { UserRole } from "@/types";

const CATEGORIES = ["Academic", "Exam", "Assignment", "Meeting", "Event", "Emergency", "Holiday", "General"];
const AUDIENCES = ["Students", "Parents", "Teachers", "Class 8", "Class 9", "Class 10", "Entire School"];

export function TeacherNoticesForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addNotice } = useNoticeStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [expiryDate, setExpiryDate] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const handleAudienceToggle = (aud: string) => {
    setTargetAudience(prev => 
      prev.includes(aud) ? prev.filter(a => a !== aud) : [...prev, aud]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (status: "draft" | "published" | "scheduled") => {
    if (!title || !content || targetAudience.length === 0) {
      toast.error("Please fill all required fields and select at least one target audience.");
      return;
    }

    // Convert string audiences to backward compatible roles if needed
    const targetRoles: UserRole[] = [];
    if (targetAudience.includes("Students") || targetAudience.includes("Entire School")) targetRoles.push("student");
    if (targetAudience.includes("Parents") || targetAudience.includes("Entire School")) targetRoles.push("parent");
    if (targetAudience.includes("Teachers") || targetAudience.includes("Entire School")) targetRoles.push("teacher");

    const data: NoticeFormData = {
      title,
      content,
      category: category as any,
      priority,
      targetAudience,
      targetRoles: targetRoles.length ? targetRoles : ["student"],
      publishDate: new Date().toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      status,
    };

    addNotice(data, "Current Teacher");
    
    if (status === "published") toast.success("Notice published successfully!");
    else if (status === "draft") toast.success("Notice saved as draft!");
    else toast.success("Notice scheduled!");
    
    // reset
    setTitle("");
    setContent("");
    setTargetAudience([]);
    setAttachments([]);
    setExpiryDate("");
    
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6 dashboard-card p-6 rounded-xl border border-white/[0.08]">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Notice Title <span className="text-red-500">*</span></Label>
          <Input 
            placeholder="E.g., Mid-Term Examination Schedule" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/[0.02] border-white/[0.08]"
          />
        </div>

        <div className="space-y-2">
          <Label>Category <span className="text-red-500">*</span></Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white/[0.02] border-white/[0.08]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
            <SelectTrigger className="bg-white/[0.02] border-white/[0.08]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Target Audience <span className="text-red-500">*</span></Label>
          <div className="flex flex-wrap gap-4 p-4 border border-white/[0.08] rounded-lg bg-white/[0.01]">
            {AUDIENCES.map(aud => (
              <div key={aud} className="flex items-center space-x-2">
                <Checkbox 
                  id={`aud-${aud}`} 
                  checked={targetAudience.includes(aud)}
                  onCheckedChange={() => handleAudienceToggle(aud)}
                />
                <label
                  htmlFor={`aud-${aud}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {aud}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Description <span className="text-red-500">*</span></Label>
          <Textarea 
            placeholder="Write the full notice content here..." 
            className="min-h-[150px] bg-white/[0.02] border-white/[0.08] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Expiry Date (Optional)</Label>
          <Input 
            type="date" 
            className="bg-white/[0.02] border-white/[0.08]"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments (PDF, Image, Doc)</Label>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white/[0.02] border-white/[0.08] w-full justify-start relative overflow-hidden">
              <Paperclip className="w-4 h-4 mr-2 text-zinc-400" />
              <span className="text-zinc-400">Attach Files...</span>
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
            </Button>
          </div>
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border border-white/[0.05] bg-white/[0.02] text-sm">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button onClick={() => removeAttachment(i)} className="text-zinc-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
        <Button variant="outline" className="bg-white/[0.02] border-white/[0.08]" onClick={() => handleSubmit("draft")}>
          <Save className="w-4 h-4 mr-2" /> Save Draft
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSubmit("published")}>
          <Send className="w-4 h-4 mr-2" /> Publish Notice
        </Button>
      </div>
    </div>
  );
}
