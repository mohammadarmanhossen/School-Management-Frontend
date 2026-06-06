"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { bookSchema, type BookFormData } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateBookPage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit = async (data: BookFormData) => {
    console.log("Submitting book data:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Book added to catalog successfully!");
    router.push("/dashboard/library");
  };

  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Book"
        description="Add a new book to the library catalog"
        breadcrumbs={[
          { label: "Library", href: "/dashboard/library" },
          { label: "Add Book" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Book Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. The Great Gatsby"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="e.g. F. Scott Fitzgerald"
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">
                ISBN <span className="text-destructive">*</span>
              </Label>
              <Input
                id="isbn"
                {...register("isbn")}
                placeholder="e.g. 978-0743273565"
              />
              {errors.isbn && (
                <p className="text-sm text-destructive">{errors.isbn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val) =>
                  setValue("category", val, { shouldValidate: true })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCopies">
                Total Copies <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalCopies"
                type="number"
                {...register("totalCopies")}
                placeholder="e.g. 10"
              />
              {errors.totalCopies && (
                <p className="text-sm text-destructive">{errors.totalCopies.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">
                Barcode / Tracking ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="barcode"
                {...register("barcode")}
                placeholder="e.g. LIB-2023-001"
              />
              {errors.barcode && (
                <p className="text-sm text-destructive">{errors.barcode.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Add Book"}
          </Button>
        </div>
      </form>
    </div>
  );
}
