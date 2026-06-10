import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { AiChatMessage as AiChatMessageType } from "@/store";

interface AiChatMessageProps {
  message: AiChatMessageType;
}

export function AiChatMessage({ message }: AiChatMessageProps) {
  const isBot = message.role === "bot";
  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={cn(
        "flex w-full mt-4 space-x-3 max-w-[85%]",
        !isBot ? "ml-auto justify-end" : ""
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "relative p-3 text-sm rounded-2xl shadow-sm",
          !isBot
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted/60 text-foreground rounded-bl-sm border"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        <div 
          className={cn(
            "flex items-center gap-1 mt-1.5 text-[10px]",
            !isBot ? "text-primary-foreground/70 justify-end" : "text-muted-foreground justify-start"
          )}
        >
          <span>{timeString}</span>
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
