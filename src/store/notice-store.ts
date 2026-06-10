import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoticeFormData } from "@/schemas";
import type { Notice } from "@/types";

interface NoticeStore {
  notices: Notice[];
  addNotice: (data: NoticeFormData, authorName: string) => Notice;
  updateNotice: (id: string, data: Partial<Notice>) => Notice | undefined;
  deleteNotice: (id: string) => void;
  getNoticeById: (id: string) => Notice | undefined;
}

export const useNoticeStore = create<NoticeStore>()(
  persist(
    (set, get) => ({
      notices: [],

      addNotice: (data, authorName) => {
        const newNotice: Notice = {
          id: crypto.randomUUID?.() || `notice-${Date.now()}`,
          title: data.title,
          shortSummary: data.shortSummary,
          content: data.content,
          category: data.category || "General",
          author: authorName,
          targetAudience: data.targetAudience || [],
          targetRoles: data.targetRoles || [],
          tags: data.tags || [],
          publishDate: data.publishDate,
          expiryDate: data.expiryDate,
          priority: data.priority,
          status: data.status,
          readCount: 0,
          unreadCount: 0,
          views: 0,
          readPercentage: 0,
          isPinned: data.isPinned || false,
          isFeatured: data.isFeatured || false,
        };
        set((state) => ({ notices: [...state.notices, newNotice] }));
        return newNotice;
      },

      updateNotice: (id, data) => {
        let updated: Notice | undefined;
        set((state) => ({
          notices: state.notices.map((notice) => {
            if (notice.id !== id) return notice;
            updated = {
              ...notice,
              ...data,
            };
            return updated;
          }),
        }));
        return updated;
      },

      deleteNotice: (id) => {
        set((state) => ({
          notices: state.notices.filter((notice) => notice.id !== id),
        }));
      },

      getNoticeById: (id) => get().notices.find((notice) => notice.id === id),
    }),
    {
      name: "notices-storage",
    }
  )
);
