"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  User,
  FileText,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit us",
    value: "123 Education Road, Dhanmondi",
    sub: "Dhaka 1205, Bangladesh",
    accent: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+880 1234-567890",
    sub: "Sun – Thu, 9 AM – 6 PM",
    accent: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-600 bg-emerald-500/10",
  },
  {
    icon: Mail,
    title: "Email us",
    value: "info@schoolmgmt.com",
    sub: "Reply within 24 hours",
    accent: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-600 bg-violet-500/10",
  },
  {
    icon: Clock,
    title: "Support hours",
    value: "Sun – Thu: 9 AM – 6 PM",
    sub: "Sat: 10 AM – 4 PM",
    accent: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 bg-amber-500/10",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Request a Demo",
  "Pricing & Plans",
  "Technical Support",
  "Partnership",
  "Other",
];

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "" },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    toast.success("Message sent successfully!");
    reset();
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t bg-gradient-to-b from-background to-muted/20 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Contact Us
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Get in touch with our team
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Have questions about pricing, need a demo, or want to see how we can help your
            school? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT_INFO.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                      item.accent
                    )}
                  />
                  <div className="relative flex gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        item.iconColor
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 font-semibold">{item.value}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/[0.03] p-6">
              <p className="font-semibold">Trusted by 500+ schools</p>
              <ul className="mt-4 space-y-3">
                {[
                  "Free 14-day trial — no credit card",
                  "Personal onboarding for every school",
                  "Local support team in Bangladesh",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="border-b bg-muted/30 px-6 py-5 sm:px-8">
                <h3 className="text-lg font-bold">Send a message</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We typically respond within one business day.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h4 className="mt-5 text-xl font-semibold">Thank you!</h4>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Your message has been received. Our team will get back to you shortly.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 rounded-xl"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Full name" error={errors.name?.message}>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="John Doe"
                            className="h-11 rounded-xl border-muted-foreground/15 bg-background pl-10"
                            {...register("name")}
                          />
                        </div>
                      </FormField>
                      <FormField label="Email" error={errors.email?.message}>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@school.edu.bd"
                            className="h-11 rounded-xl border-muted-foreground/15 bg-background pl-10"
                            {...register("email")}
                          />
                        </div>
                      </FormField>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Phone (optional)">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="01XXXXXXXXX"
                            className="h-11 rounded-xl border-muted-foreground/15 bg-background pl-10"
                            {...register("phone")}
                          />
                        </div>
                      </FormField>
                      <FormField label="Subject" error={errors.subject?.message}>
                        <Select
                          onValueChange={(v) =>
                            setValue("subject", v, { shouldValidate: true })
                          }
                        >
                          <SelectTrigger className="h-11 rounded-xl border-muted-foreground/15 bg-background">
                            <SelectValue placeholder="What can we help with?" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUBJECTS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    <FormField label="Message" error={errors.message?.message}>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="Tell us about your school, student count, and what you're looking for..."
                          rows={5}
                          className="min-h-[140px] resize-none rounded-xl border-muted-foreground/15 bg-background pl-10 pt-3"
                          {...register("message")}
                        />
                      </div>
                    </FormField>

                    <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        By submitting, you agree to our privacy policy. We never share your data.
                      </p>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="h-11 shrink-0 rounded-xl px-8 shadow-md shadow-primary/20"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
