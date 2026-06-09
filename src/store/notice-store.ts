import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoticeFormData } from "@/schemas";
import type { Notice } from "@/types";

interface NoticeStore {
  notices: Notice[];
  addNotice: (data: NoticeFormData, authorName: string) => Notice;
  updateNotice: (id: string, data: Partial<NoticeFormData>) => Notice | undefined;
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
          content: data.content,
          author: authorName,
          targetRoles: data.targetRoles,
          publishDate: data.publishDate,
          expiryDate: data.expiryDate,
          priority: data.priority,
          status: data.status,
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
