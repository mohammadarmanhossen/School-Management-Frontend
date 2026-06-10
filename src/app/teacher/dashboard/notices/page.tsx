"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  Search, Filter, Inbox, Star, Bookmark, AlertCircle, 
  Clock, CheckCircle2, ChevronRight, X, Download, 
  Share2, Paperclip, MailOpen, Mail, Pin, Bell, FileX
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { useNoticeStore } from "@/store/notice-store";
import type { Notice } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Academic", "Examination", "Assignment", "Meeting", "Event", "Holiday", "Emergency", "Training", "Administration", "General Announcement"];

type FilterTab = "inbox" | "unread" | "important" | "urgent" | "saved" | "pinned" | "expiring";

export default function TeacherNoticeCenterPage() {
  const { notices, updateNotice } = useNoticeStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter notices for Teacher view (published only)
  const teacherNotices = notices.filter(n => ["published", "scheduled"].includes(n.status));

  const filteredNotices = useMemo(() => {
    return teacherNotices.filter(n => {
      // Search
      const searchMatch = !searchQuery || 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category
      const catMatch = categoryFilter === "All" || n.category === categoryFilter;

      // Tab Filters
      let tabMatch = true;
      if (activeTab === "unread") tabMatch = !n.isRead;
      if (activeTab === "important") tabMatch = n.priority === "high" || n.priority === "urgent";
      if (activeTab === "urgent") tabMatch = n.priority === "urgent";
      if (activeTab === "saved") tabMatch = !!n.isSaved;
      if (activeTab === "pinned") tabMatch = !!n.isPinned;
      if (activeTab === "expiring") {
        if (!n.expiryDate) tabMatch = false;
        else {
          const daysLeft = (new Date(n.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
          tabMatch = daysLeft > 0 && daysLeft <= 7;
        }
      }

      return searchMatch && catMatch && tabMatch;
    }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [teacherNotices, searchQuery, categoryFilter, activeTab]);

  // Actions
  const toggleRead = (e: React.MouseEvent, id: string, currentState: boolean) => {
    e.stopPropagation();
    updateNotice(id, { isRead: !currentState });
    toast.success(`Marked as ${!currentState ? 'Read' : 'Unread'}`);
  };

  const toggleSave = (e: React.MouseEvent, id: string, currentState: boolean) => {
    e.stopPropagation();
    updateNotice(id, { isSaved: !currentState });
    toast.success(!currentState ? "Notice saved for later" : "Notice removed from saved");
  };

  const togglePin = (e: React.MouseEvent, id: string, currentState: boolean) => {
    e.stopPropagation();
    updateNotice(id, { isPinned: !currentState });
    toast.success(!currentState ? "Notice pinned" : "Notice unpinned");
  };

  const openNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDrawerOpen(true);
    if (!notice.isRead) {
      updateNotice(notice.id, { isRead: true });
    }
  };

  // Stats
  const stats = {
    total: teacherNotices.length,
    unread: teacherNotices.filter(n => !n.isRead).length,
    important: teacherNotices.filter(n => n.priority === "high" || n.priority === "urgent").length,
    urgent: teacherNotices.filter(n => n.priority === "urgent").length,
  };

  const priorityColors = {
    low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
  };

  return (
    <div className="space-y-6 pb-10 flex flex-col h-[calc(100vh-80px)]">
      <PageHeader 
        title="Notice Center" 
        description="Your central hub for all school communications, events, and important announcements." 
        breadcrumbs={[
          { label: "Teacher Dashboard", href: "/teacher/dashboard" },
          { label: "Notice Center" }
        ]}
      />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 shrink-0">
        <Card className="dashboard-card border-white/[0.08] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400 mb-1">Total Notices</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <Inbox className="h-8 w-8 text-blue-400 opacity-20" />
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400 mb-1">Unread</div>
            <div className="text-2xl font-bold text-blue-400">{stats.unread}</div>
          </div>
          <Mail className="h-8 w-8 text-blue-400 opacity-20" />
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400 mb-1">Important</div>
            <div className="text-2xl font-bold text-amber-400">{stats.important}</div>
          </div>
          <Star className="h-8 w-8 text-amber-400 opacity-20" />
        </Card>
        <Card className="dashboard-card border-white/[0.08] p-4 flex items-center justify-between bg-red-500/5 border-red-500/20">
          <div>
            <div className="text-sm text-red-400 mb-1">Urgent</div>
            <div className="text-2xl font-bold text-red-500">{stats.urgent}</div>
          </div>
          <AlertCircle className="h-8 w-8 text-red-500 opacity-20" />
        </Card>
      </div>

      {/* Gmail Style Layout */}
      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-[240px] shrink-0 hidden lg:flex flex-col gap-2">
          <Button variant={activeTab === "inbox" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("inbox")}>
            <Inbox className="w-4 h-4 mr-2" /> All Inbox
            <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs py-0.5 px-2 rounded-full">{stats.total}</span>
          </Button>
          <Button variant={activeTab === "unread" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("unread")}>
            <Mail className="w-4 h-4 mr-2" /> Unread
            {stats.unread > 0 && <span className="ml-auto bg-blue-500 text-white text-xs py-0.5 px-2 rounded-full">{stats.unread}</span>}
          </Button>
          <Button variant={activeTab === "important" ? "secondary" : "ghost"} className="justify-start text-amber-400/90 hover:text-amber-400 hover:bg-amber-500/10" onClick={() => setActiveTab("important")}>
            <Star className="w-4 h-4 mr-2" /> Important
          </Button>
          <Button variant={activeTab === "urgent" ? "secondary" : "ghost"} className="justify-start text-red-400/90 hover:text-red-400 hover:bg-red-500/10" onClick={() => setActiveTab("urgent")}>
            <AlertCircle className="w-4 h-4 mr-2" /> Urgent
          </Button>
          <Separator className="my-2 bg-white/[0.05]" />
          <Button variant={activeTab === "pinned" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("pinned")}>
            <Pin className="w-4 h-4 mr-2" /> Pinned
          </Button>
          <Button variant={activeTab === "saved" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("saved")}>
            <Bookmark className="w-4 h-4 mr-2" /> Saved for Later
          </Button>
          <Button variant={activeTab === "expiring" ? "secondary" : "ghost"} className="justify-start" onClick={() => setActiveTab("expiring")}>
            <Clock className="w-4 h-4 mr-2" /> Expiring Soon
          </Button>
        </div>

        {/* Main List Area */}
        <Card className="flex-1 dashboard-card border-white/[0.08] flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.01]">
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input 
                placeholder="Search notices..." 
                className="pl-9 bg-white/[0.02] border-white/[0.08]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white/[0.02] border-white/[0.08]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              
              {/* Mobile Tab Select */}
              <div className="lg:hidden">
                <Select value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-white/[0.02] border-white/[0.08]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbox">All Inbox</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="pinned">Pinned</SelectItem>
                    <SelectItem value="saved">Saved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/[0.04]">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    onClick={() => openNotice(notice)}
                    className={cn(
                      "flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-white/[0.03]",
                      !notice.isRead ? "bg-blue-500/[0.02]" : "opacity-80"
                    )}
                  >
                    {/* Actions Left */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={(e) => togglePin(e, notice.id, !!notice.isPinned)} 
                        className={cn("p-1.5 rounded hover:bg-white/[0.1] transition-colors", notice.isPinned ? "text-blue-400" : "text-zinc-500 hover:text-blue-400")}
                      >
                        <Pin className={cn("w-4 h-4", notice.isPinned && "fill-current")} />
                      </button>
                      <button 
                        onClick={(e) => toggleSave(e, notice.id, !!notice.isSaved)} 
                        className={cn("p-1.5 rounded hover:bg-white/[0.1] transition-colors", notice.isSaved ? "text-amber-400" : "text-zinc-500 hover:text-amber-400")}
                      >
                        <Bookmark className={cn("w-4 h-4", notice.isSaved && "fill-current")} />
                      </button>
                    </div>

                    {/* Core Content */}
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                      <div className="flex items-center gap-2 shrink-0 md:w-[160px]">
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", priorityColors[notice.priority])}>
                          {notice.priority.toUpperCase()}
                        </Badge>
                        <span className={cn("text-sm truncate", !notice.isRead && "font-semibold")}>
                          {notice.author}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className={cn("text-sm truncate", !notice.isRead ? "font-semibold text-white" : "text-zinc-300")}>
                          {notice.title}
                        </span>
                        {notice.shortSummary && (
                          <span className="text-sm text-zinc-500 truncate hidden lg:inline-block">
                            - {notice.shortSummary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata Right */}
                    <div className="flex items-center gap-4 shrink-0 text-zinc-500 text-xs">
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Paperclip className="w-4 h-4" />
                      )}
                      <span className={cn(!notice.isRead && "font-semibold text-blue-400")}>
                        {format(new Date(notice.publishDate), "MMM d")}
                      </span>
                      <button 
                        onClick={(e) => toggleRead(e, notice.id, !!notice.isRead)} 
                        className="p-1.5 rounded hover:bg-white/[0.1] transition-colors hidden sm:block"
                        title={notice.isRead ? "Mark as unread" : "Mark as read"}
                      >
                        {notice.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-blue-400" />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">You're all caught up!</h3>
                  <p className="text-zinc-500">No notices found matching your current filters.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Notice Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl bg-[#0a0a0a] border-white/[0.08] p-0 flex flex-col">
          {selectedNotice && (
            <>
              {/* Drawer Header Actions */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => updateNotice(selectedNotice.id, { isSaved: !selectedNotice.isSaved })}>
                    <Bookmark className={cn("w-5 h-5", selectedNotice.isSaved ? "text-amber-400 fill-current" : "text-zinc-400")} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => updateNotice(selectedNotice.id, { isPinned: !selectedNotice.isPinned })}>
                    <Pin className={cn("w-5 h-5", selectedNotice.isPinned ? "text-blue-400 fill-current" : "text-zinc-400")} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    updateNotice(selectedNotice.id, { isRead: false });
                    setIsDrawerOpen(false);
                    toast.success("Marked as unread");
                  }}>
                    <Mail className="w-5 h-5 text-zinc-400" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-white/[0.02] border-white/[0.08]">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>
              </div>

              {/* Drawer Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Meta */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className={cn(priorityColors[selectedNotice.priority])}>
                        {selectedNotice.priority.toUpperCase()} PRIORITY
                      </Badge>
                      <span className="text-sm text-zinc-400">
                        {format(new Date(selectedNotice.publishDate), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{selectedNotice.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="font-medium text-white">{selectedNotice.author}</span>
                      <span>to</span>
                      <span className="bg-white/[0.05] px-2 py-0.5 rounded">{selectedNotice.targetAudience?.join(", ") || "All"}</span>
                    </div>
                    {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedNotice.tags.map(t => (
                          <Badge key={t} variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/[0.08]" />

                  {/* Body */}
                  <div className="prose prose-invert max-w-none text-zinc-300">
                    {selectedNotice.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Attachments */}
                  {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/[0.08]">
                      <h4 className="text-sm font-medium mb-4 flex items-center"><Paperclip className="w-4 h-4 mr-2" /> {selectedNotice.attachments.length} Attachments</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedNotice.attachments.map((att, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.08] bg-white/[0.02] group hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-10 h-10 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <FileX className="w-5 h-5" /> {/* placeholder icon */}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">{att}</span>
                                <span className="text-xs text-zinc-500">Document</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Download className="w-4 h-4 text-zinc-400 hover:text-white" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedNotice.expiryDate && (
                    <div className="mt-8 p-4 rounded-lg bg-red-500/5 border border-red-500/10 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium text-red-400">Action Required</h5>
                        <p className="text-sm text-red-400/80">This notice will expire on {format(new Date(selectedNotice.expiryDate), "MMMM d, yyyy")}. Please ensure all necessary actions are taken before this date.</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
