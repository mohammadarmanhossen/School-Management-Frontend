import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookFormData } from "@/schemas";
import type { Book } from "@/types";

interface BookStore {
  books: Book[];
  addBook: (data: BookFormData) => Book;
  updateBook: (id: string, data: Partial<BookFormData>) => Book | undefined;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: [],

      addBook: (data) => {
        const newBook: Book = {
          id: crypto.randomUUID?.() || `book-${Date.now()}`,
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          category: data.category,
          totalCopies: data.totalCopies,
          availableCopies: data.totalCopies, // initially all copies are available
          barcode: data.barcode,
        };
        set((state) => ({ books: [...state.books, newBook] }));
        return newBook;
      },

      updateBook: (id, data) => {
        let updated: Book | undefined;
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== id) return book;
            
            // Adjust available copies if total copies changed
            let newAvailable = book.availableCopies;
            if (data.totalCopies !== undefined) {
              const diff = data.totalCopies - book.totalCopies;
              newAvailable = Math.max(0, book.availableCopies + diff);
            }

            updated = {
              ...book,
              ...data,
              availableCopies: newAvailable,
            };
            return updated;
          }),
        }));
        return updated;
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      },

      getBookById: (id) => get().books.find((book) => book.id === id),
    }),
    {
      name: "books-storage",
    }
  )
);
