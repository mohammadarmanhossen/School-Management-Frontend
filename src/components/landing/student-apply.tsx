"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  GraduationCap,
  User,
  Calendar,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  Send,
  FileText,
  Clock,
  Sparkles,
  School,
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
import { GENDERS } from "@/constants";
import {
  studentAdmissionApplySchema,
  type StudentAdmissionApplyFormData,
} from "@/schemas";
import { applicationService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { useApplicationStore } from "@/store/application-store";

const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

const ADMISSION_STEPS = [
  {
    step: "01",
    title: "Submit application",
    description: "Fill out the online form with student and contact details.",
  },
  {
    step: "02",
    title: "Document review",
    description: "Our team verifies your information within 3–5 business days.",
  },
  {
    step: "03",
    title: "Interview & assessment",
    description: "Shortlisted candidates are invited for a brief meeting.",
  },
  {
    step: "04",
    title: "Enrollment confirmed",
    description: "Receive your admission letter and complete fee payment.",
  },
];

const REQUIREMENTS = [
  "Birth certificate or age proof",
  "Previous school report card (if applicable)",
  "Two recent passport-size photos",
  "Guardian NID copy",
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
      <Label className="text-sm font-medium text-foreground/90">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
          {number}
        </div>
        <div>
          <h4 className="font-semibold leading-none">{title}</h4>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4 pl-0 sm:pl-[52px]">{children}</div>
    </div>
  );
}

const inputClass =
  "h-11 rounded-xl border-muted-foreground/15 bg-background transition-colors focus-visible:ring-primary/30";

export function StudentApplySection() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StudentAdmissionApplyFormData>({
    resolver: zodResolver(studentAdmissionApplySchema),
    defaultValues: { gender: undefined, class_name: "" },
  });

  const onSubmit = async (data: StudentAdmissionApplyFormData) => {
    setIsLoading(true);
    try {
      await applicationService.submitStudentAdmission(data);
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        await new Promise((r) => setTimeout(r, 800));
        useApplicationStore.getState().addStudentRequest(data);
        toast.success("Application received! We will contact you soon.");
      } else {
        toast.error(getErrorMessage(error));
        setIsLoading(false);
        return;
      }
    }
    setSubmitted(true);
    reset();
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      id="student-apply"
      className="relative overflow-hidden border-t bg-gradient-to-b from-muted/30 via-background to-muted/20 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
            <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
            Admissions Open 2025–26
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Begin your{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              learning journey
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Apply online in minutes. Our admissions team guides you through every step — from
            application to enrollment.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Session 2025–26</p>
                    <p className="text-sm text-muted-foreground">Limited seats available</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Classes", value: "1 – 12" },
                    { label: "Response", value: "3–5 days" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border bg-background/60 px-4 py-3 backdrop-blur-sm"
                    >
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="mt-0.5 font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  How it works
                </h3>
                <ol className="mt-5 space-y-5">
                  {ADMISSION_STEPS.map((item, index) => (
                    <li key={item.step} className="relative flex gap-4">
                      {index < ADMISSION_STEPS.length - 1 && (
                        <span className="absolute left-[15px] top-9 h-[calc(100%+4px)] w-px bg-border" />
                      )}
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-xs font-bold text-primary">
                        {item.step}
                      </div>
                      <div className="pb-1">
                        <p className="font-medium leading-snug">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4 text-primary" />
                  Documents to prepare
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {REQUIREMENTS.map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300",
                  "hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5"
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Need help?
                    </p>
                    <p className="mt-1 font-semibold">+880 1234-567890</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Sun – Thu, 9 AM – 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
              <div className="border-b bg-muted/40 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Admission application</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete all sections below to apply
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      </div>
                    </div>
                    <h4 className="mt-6 text-2xl font-bold">You&apos;re all set!</h4>
                    <p className="mt-3 max-w-sm text-muted-foreground">
                      Your application has been received. We&apos;ll contact you within 3–5 business
                      days with the next steps.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 rounded-xl px-6"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit another application
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    <FormSection
                      number="1"
                      title="Student information"
                      description="Basic details about the applicant"
                    >
                      <FormField label="Full name" error={errors.full_name?.message}>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Student's full name"
                            className={cn(inputClass, "pl-10")}
                            {...register("full_name")}
                          />
                        </div>
                      </FormField>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Date of birth" error={errors.dob?.message}>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="date"
                              className={cn(inputClass, "pl-10")}
                              {...register("dob")}
                            />
                          </div>
                        </FormField>
                        <FormField label="Gender" error={errors.gender?.message}>
                          <Select
                            onValueChange={(v) =>
                              setValue("gender", v as StudentAdmissionApplyFormData["gender"], {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger className={inputClass}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {GENDERS.map((g) => (
                                <SelectItem key={g.value} value={g.value}>
                                  {g.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>

                      <FormField label="Class applying for" error={errors.class_name?.message}>
                        <Select
                          onValueChange={(v) =>
                            setValue("class_name", v, { shouldValidate: true })
                          }
                        >
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {CLASSES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField label="Phone number" error={errors.phone?.message}>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="01XXXXXXXXX"
                            className={cn(inputClass, "pl-10")}
                            {...register("phone")}
                          />
                        </div>
                      </FormField>
                    </FormSection>

                    <div className="border-t border-dashed" />

                    <FormSection
                      number="2"
                      title="Address"
                      description="Where the student currently resides"
                    >
                      <FormField label="Full address" error={errors.address?.message}>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="House / road, area, city, district"
                            rows={4}
                            className="min-h-[120px] resize-none rounded-xl border-muted-foreground/15 bg-background pl-10 pt-3 transition-colors focus-visible:ring-primary/30"
                            {...register("address")}
                          />
                        </div>
                      </FormField>
                    </FormSection>

                    <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                          By submitting, you confirm the information is accurate and agree to our
                          admission policy and privacy terms.
                        </p>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isLoading}
                          className="h-12 shrink-0 rounded-xl px-8 font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Application
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
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

export default StudentApplySection;
