import { useState, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const QUICK_REPLIES = [
  "Exam Schedule",
  "Holidays",
  "Admission",
  "Contact Info"
];

export function AiChatInput({ onSend, disabled }: AiChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!disabled) {
      onSend(reply);
    }
  };

  return (
    <div className="flex flex-col bg-background border-t">
      {/* Quick Replies */}
      <div className="flex overflow-x-auto gap-2 p-3 pb-0 no-scrollbar">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            disabled={disabled}
            className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3 w-3" />
            {reply}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask me anything..."
          className="flex-1 max-h-32 min-h-[40px] resize-none rounded-2xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!text.trim() || disabled}
          className="shrink-0 rounded-full h-10 w-10 transition-transform active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
