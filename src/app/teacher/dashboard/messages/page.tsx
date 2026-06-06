"use client";

import { useState } from "react";
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, Phone, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockMessages } from "@/lib/mock-data";

export default function MessagesPage() {
  const [messages] = useState(mockMessages);
  const [activeMessage, setActiveMessage] = useState(messages[0]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="Messages"
        description="Communicate directly with your students, parents, and administration."
        breadcrumbs={[
          { label: "Dashboard", href: "/teacher/dashboard" },
          { label: "Messages" },
        ]}
      />

      <Card className="flex-1 overflow-hidden border-white/[0.08] bg-zinc-950 flex shadow-2xl">
        {/* Sidebar - Message List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-white/[0.06] flex flex-col bg-zinc-900/20">
          <div className="p-4 border-b border-white/[0.06] space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-zinc-900 border-white/[0.1] focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 cursor-pointer">All</Badge>
              <Badge variant="outline" className="border-white/[0.1] text-zinc-400 cursor-pointer">Unread</Badge>
              <Badge variant="outline" className="border-white/[0.1] text-zinc-400 cursor-pointer">Parents</Badge>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => setActiveMessage(msg)}
                className={`p-4 border-b border-white/[0.02] cursor-pointer transition-colors hover:bg-white/[0.04] flex gap-4 ${activeMessage.id === msg.id ? 'bg-blue-500/5' : ''}`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border border-white/[0.1]">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">{msg.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {msg.unread && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-zinc-950" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm truncate pr-2 ${msg.unread ? 'font-semibold text-white' : 'font-medium text-zinc-200'}`}>
                      {msg.sender}
                    </h4>
                    <span className="text-xs text-zinc-500 shrink-0">{msg.timestamp}</span>
                  </div>
                  <p className={`text-xs line-clamp-1 ${msg.unread ? 'text-zinc-300 font-medium' : 'text-zinc-500'}`}>
                    {msg.content}
                  </p>
                  <Badge variant="outline" className="mt-2 text-[10px] px-1.5 py-0 border-white/[0.1] text-zinc-400 uppercase tracking-wider">
                    {msg.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Active Chat */}
        <div className="hidden md:flex flex-1 flex-col bg-zinc-950">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.06] flex justify-between items-center bg-zinc-900/40">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-white/[0.1]">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeMessage.sender}`} />
                <AvatarFallback>{activeMessage.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{activeMessage.sender}</h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Active now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Chat Messages Area (Mocked with one message for layout) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex justify-center">
              <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/[0.05]">
                Today
              </span>
            </div>
            
            <div className="flex gap-4 max-w-[80%]">
              <Avatar className="h-8 w-8 mt-1 border border-white/[0.1] shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeMessage.sender}`} />
                <AvatarFallback>{activeMessage.sender.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-zinc-900 border border-white/[0.05] p-3 rounded-2xl rounded-tl-sm text-sm text-zinc-200">
                  {activeMessage.content}
                </div>
                <span className="text-xs text-zinc-500 mt-1 ml-1 inline-block">{activeMessage.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/[0.06] bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white shrink-0 hidden sm:flex">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Input 
                placeholder={`Reply to ${activeMessage.sender}...`}
                className="flex-1 bg-zinc-950 border-white/[0.1] focus-visible:ring-blue-500 rounded-full px-4"
              />
              <Button size="icon" className="shrink-0 bg-blue-600 hover:bg-blue-700 rounded-full h-10 w-10">
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
