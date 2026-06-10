import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'user' | 'bot';

export interface AiChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
}

interface AiChatState {
  isOpen: boolean;
  messages: AiChatMessage[];
  isTyping: boolean;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (text: string) => void;
  receiveMessage: (text: string) => void;
  clearHistory: () => void;
}

const INITIAL_MESSAGE: AiChatMessage = {
  id: 'msg_welcome',
  role: 'bot',
  text: "Hello! 👋 I'm your School Assistant. How can I help you today? You can ask me about exam schedules, holidays, or any other school-related questions.",
  timestamp: new Date().toISOString(),
};

const FAQ_DATABASE: Record<string, string> = {
  'exam schedule': 'The mid-term exams will begin on October 15th and end on October 28th. A detailed schedule will be published on the notice board soon.',
  'holidays': 'The school will be closed for the Winter Break from December 20th to January 2nd.',
  'admission': 'Admissions for the new academic year open in March. Please visit the Admission Office or check our website for details.',
  'contact': 'You can reach the administration desk at admin@school.edu or call +123 456 7890.',
};

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      messages: [INITIAL_MESSAGE],
      isTyping: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      sendMessage: (text) => {
        const userMsg: AiChatMessage = {
          id: `msg_user_${Date.now()}`,
          role: 'user',
          text,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMsg],
          isTyping: true,
        }));

        // Mock AI thinking delay
        setTimeout(() => {
          const lowerText = text.toLowerCase();
          let botResponse = "I'm sorry, I don't have information on that specific topic right now. Please contact the main office for further assistance.";
          
          for (const [key, answer] of Object.entries(FAQ_DATABASE)) {
            if (lowerText.includes(key)) {
              botResponse = answer;
              break;
            }
          }

          get().receiveMessage(botResponse);
        }, 1500);
      },

      receiveMessage: (text) => {
        const botMsg: AiChatMessage = {
          id: `msg_bot_${Date.now()}`,
          role: 'bot',
          text,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, botMsg],
          isTyping: false,
        }));
      },

      clearHistory: () => {
        set({ messages: [INITIAL_MESSAGE] });
      }
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
