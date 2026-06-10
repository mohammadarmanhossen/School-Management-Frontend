"use client";

import { useEffect, useState, useRef } from "react";
import { Bot, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiChatStore } from "@/store";
import { AiChatMessage } from "./ai-chat-message";
import { AiChatInput } from "./ai-chat-input";

export function AiChatWidget() {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    sendMessage,
    isTyping,
    clearHistory
  } = useAiChatStore();

  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom when new messages arrive or isTyping changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
          >
            <Bot className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Popover Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] h-[600px] max-h-[85vh] bg-background border rounded-2xl shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 origin-bottom-right">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 p-1.5 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">AI Assistant</h3>
                <p className="text-[10px] text-primary-foreground/70">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
                onClick={clearHistory}
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-muted/10 scroll-smooth">
            {messages.map((msg) => (
              <AiChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex w-full mt-4 space-x-3 max-w-[85%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted/60 text-foreground p-3 rounded-2xl rounded-bl-sm border flex items-center gap-2 h-10 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <AiChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      )}
    </>
  );
}
