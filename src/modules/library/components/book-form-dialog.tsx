"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Book } from "@/types";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  isbn: z.string().min(1, "ISBN is required"),
  totalCopies: z.coerce.number().min(1),
  availableCopies: z.coerce.number().min(0),
  barcode: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSubmit: (data: BookFormData) => void;
  isLoading?: boolean;
}

export function BookFormDialog({
  open,
  onOpenChange,
  book,
  onSubmit,
  isLoading,
}: BookFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book ?? {
      title: "",
      author: "",
      category: "",
      isbn: "",
      totalCopies: 1,
      availableCopies: 1,
      barcode: "",
    },
  });

  const handleFormSubmit = (data: BookFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dashboard-card border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} defaultValue={book?.title} />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} defaultValue={book?.author} />
            {errors.author && <p className="text-xs text-red-400">{errors.author.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} defaultValue={book?.category} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" {...register("isbn")} defaultValue={book?.isbn} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Quantity</Label>
              <Input id="totalCopies" type="number" {...register("totalCopies")} defaultValue={book?.totalCopies} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableCopies">Available Copies</Label>
              <Input id="availableCopies" type="number" {...register("availableCopies")} defaultValue={book?.availableCopies} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode">Barcode</Label>
            <Input id="barcode" {...register("barcode")} defaultValue={book?.barcode} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {book ? "Update" : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
