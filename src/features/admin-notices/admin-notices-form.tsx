"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Save, Send, Paperclip, X, Tag as TagIcon, LayoutTemplate, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useNoticeStore } from "@/store/notice-store";
import { NoticeFormData } from "@/schemas";

const CATEGORIES = ["Student", "Teacher", "Parent", "Academic", "Exam", "Assignment", "Holiday", "Event", "Meeting", "Emergency", "Fee", "Library", "Transport", "Training", "Administration", "General"];
const AUDIENCES = ["All Users", "All Students", "Specific Class", "Specific Section", "All Teachers", "Specific Teachers", "All Parents", "Library Staff", "Transport Staff"];
const TEMPLATES = [
  { id: "t1", name: "Exam Schedule", title: "Upcoming Term Examinations", content: "Please be informed that the upcoming term examinations will commence on..." },
  { id: "t2", name: "Fee Reminder", title: "Monthly Fee Reminder", content: "This is a gentle reminder that the monthly school fees are due by the 10th of this month..." },
  { id: "t3", name: "Holiday", title: "School Holiday Announcement", content: "The school will remain closed from [Date] to [Date] on account of [Reason]..." },
];

export function AdminNoticesForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addNotice } = useNoticeStore();

  const [title, setTitle] = useState("");
  const [shortSummary, setShortSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Tags handling
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAudienceToggle = (aud: string) => {
    if (aud === "All Users") {
      if (targetAudience.includes("All Users")) {
        setTargetAudience([]);
      } else {
        setTargetAudience(["All Users"]);
      }
      return;
    }
    
    setTargetAudience(prev => {
      const filtered = prev.filter(a => a !== "All Users");
      return filtered.includes(aud) ? filtered.filter(a => a !== aud) : [...filtered, aud];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const loadTemplate = (templateId: string) => {
    const t = TEMPLATES.find(x => x.id === templateId);
    if (t) {
      setTitle(t.title);
      setContent(t.content);
      toast.info(`Loaded template: ${t.name}`);
    }
  };

  const handleSubmit = (status: "draft" | "published" | "scheduled") => {
    if (!title || !content || targetAudience.length === 0) {
      toast.error("Please fill all required fields and select a target audience.");
      return;
    }

    const finalStatus = (status === "published" && publishDate && new Date(publishDate) > new Date()) 
      ? "scheduled" 
      : status;

    const data: NoticeFormData = {
      title,
      shortSummary,
      content,
      category: category as any,
      priority,
      targetAudience,
      tags,
      publishDate: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      status: finalStatus,
      isPinned,
      isFeatured,
    };

    addNotice(data, "System Admin");
    
    if (finalStatus === "published") toast.success("Notice published live!");
    else if (finalStatus === "draft") toast.success("Draft saved successfully.");
    else toast.success("Notice scheduled for publishing.");
    
    // reset
    setTitle("");
    setShortSummary("");
    setContent("");
    setTargetAudience([]);
    setAttachments([]);
    setTags([]);
    setPublishDate("");
    setExpiryDate("");
    setIsPinned(false);
    setIsFeatured(false);
    
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6 dashboard-card p-6 rounded-xl border border-white/[0.08]">
      
      {/* Templates Quick Load */}
      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <LayoutTemplate className="w-5 h-5 text-blue-400 shrink-0" />
        <span className="text-sm font-medium text-blue-400 mr-2">Quick Templates:</span>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <Button key={t.id} variant="outline" size="sm" className="h-7 text-xs bg-white/[0.02] border-blue-500/30 hover:bg-blue-500/20" onClick={() => loadTemplate(t.id)}>
              {t.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Notice Title <span className="text-red-500">*</span></Label>
          <Input 
            placeholder="Main headline of the notice" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/[0.02] border-white/[0.08] text-lg font-medium"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Short Summary</Label>
          <Input 
            placeholder="A brief 1-2 sentence overview for push notifications and email subjects" 
            value={shortSummary}
            onChange={(e) => setShortSummary(e.target.value)}
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
          <Label>Full Content <span className="text-red-500">*</span></Label>
          <div className="border border-white/[0.08] rounded-md focus-within:ring-1 focus-within:ring-ring">
            {/* Fake Rich Text Toolbar */}
            <div className="flex items-center gap-1 border-b border-white/[0.08] bg-white/[0.02] p-1 px-2">
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white"><strong className="font-serif">B</strong></Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white"><i className="font-serif">I</i></Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white"><u className="font-serif">U</u></Button>
               <div className="w-px h-4 bg-white/[0.1] mx-1"></div>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white">H1</Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white">H2</Button>
               <div className="w-px h-4 bg-white/[0.1] mx-1"></div>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-white flex"><span className="w-1 h-1 bg-current rounded-full mx-auto"></span></Button>
            </div>
            <Textarea 
              placeholder="Write the full notice content here. Supports rich text, links, and styling." 
              className="min-h-[250px] bg-transparent border-0 resize-y focus-visible:ring-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Publish Date (Schedule for later)</Label>
          <Input 
            type="datetime-local" 
            className="bg-white/[0.02] border-white/[0.08]"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Auto Expiry Date</Label>
          <Input 
            type="datetime-local" 
            className="bg-white/[0.02] border-white/[0.08]"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex items-center border border-white/[0.08] rounded-md bg-white/[0.02] px-3 focus-within:ring-1 focus-within:ring-ring">
              <TagIcon className="w-4 h-4 text-zinc-400 mr-2" />
              <Input 
                placeholder="Press Enter to add tag" 
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="border-0 bg-transparent px-0 focus-visible:ring-0 h-10"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(t => (
                  <Badge key={t} variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                    {t} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(t)}/>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 border border-white/[0.08] rounded-lg bg-white/[0.02]">
              <div className="space-y-0.5">
                <Label>Pin to Dashboard</Label>
                <div className="text-xs text-zinc-400">Keep this notice at the top of feeds</div>
              </div>
              <Switch checked={isPinned} onCheckedChange={setIsPinned} />
            </div>
            
            <div className="flex items-center justify-between p-3 border border-amber-500/20 rounded-lg bg-amber-500/5">
              <div className="space-y-0.5">
                <Label className="text-amber-500">Featured Announcement</Label>
                <div className="text-xs text-amber-500/70">Highlight in login screens and banners</div>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Attachments (PDF, Images, Excel, Docs)</Label>
          <div className="flex flex-col gap-2">
            <div className="border-2 border-dashed border-white/[0.1] rounded-lg p-6 text-center hover:bg-white/[0.02] transition-colors relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Paperclip className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Click or drag files here to attach</p>
              <p className="text-xs text-zinc-500 mt-1">Supports multiple files up to 10MB each</p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded border border-white/[0.05] bg-white/[0.02] text-sm group">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-zinc-500 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button onClick={() => removeAttachment(i)} className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.08]">
        <Button variant="outline" className="bg-white/[0.02] border-white/[0.08]" onClick={() => handleSubmit("draft")}>
          <Save className="w-4 h-4 mr-2" /> Save Draft
        </Button>
        <Button 
          className={publishDate && new Date(publishDate) > new Date() ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} 
          onClick={() => handleSubmit("published")}
        >
          {publishDate && new Date(publishDate) > new Date() ? (
            <><Clock className="w-4 h-4 mr-2" /> Schedule Notice</>
          ) : (
            <><Send className="w-4 h-4 mr-2" /> Publish Now</>
          )}
        </Button>
      </div>
    </div>
  );
}
