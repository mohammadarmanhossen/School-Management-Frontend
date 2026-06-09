"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Loader2,
  CheckCircle2,
  Send,
  Clock,
  Sparkles,
  GraduationCap,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { teacherApplySchema, type TeacherApplyFormData } from "@/schemas";
import { applicationService } from "@/services";
import { getErrorMessage } from "@/services/api-client";
import { useApplicationStore } from "@/store/application-store";

const HIRING_STEPS = [
  {
    step: "01",
    title: "Submit application",
    description: "Share your qualifications, experience, and subject expertise.",
  },
  {
    step: "02",
    title: "Application screening",
    description: "Our HR team reviews your profile within 5–7 business days.",
  },
  {
    step: "03",
    title: "Demo class & interview",
    description: "Shortlisted candidates deliver a demo lesson and interview.",
  },
  {
    step: "04",
    title: "Offer & onboarding",
    description: "Selected teachers receive an offer and join our faculty.",
  },
];

const OPEN_POSITIONS = [
  "Mathematics & Science",
  "English & Bangla",
  "Social Studies",
  "Computer & ICT",
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-bold text-emerald-600">
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
  "h-11 rounded-xl border-muted-foreground/15 bg-background transition-colors focus-visible:ring-emerald-500/30";

export function TeacherApplySection() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherApplyFormData>({
    resolver: zodResolver(teacherApplySchema),
  });

  const onSubmit = async (data: TeacherApplyFormData) => {
    setIsLoading(true);
    try {
      await applicationService.submitTeacherApplication(data);
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        await new Promise((r) => setTimeout(r, 800));
        useApplicationStore.getState().addTeacherRequest(data);
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
      id="teacher-apply"
      className="relative overflow-hidden border-t bg-gradient-to-b from-muted/30 via-background to-muted/20 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.015] [background-image:radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5">
            <Briefcase className="mr-1.5 h-3.5 w-3.5" />
            Now Hiring Teachers
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Shape the future,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              teach with us
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join a passionate team of educators. Apply today and help students reach their full
            potential.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-5">
              <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Faculty openings</p>
                    <p className="text-sm text-muted-foreground">Multiple subjects available</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Experience", value: "1+ years" },
                    { label: "Response", value: "5–7 days" },
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
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Hiring process
                </h3>
                <ol className="mt-5 space-y-5">
                  {HIRING_STEPS.map((item, index) => (
                    <li key={item.step} className="relative flex gap-4">
                      {index < HIRING_STEPS.length - 1 && (
                        <span className="absolute left-[15px] top-9 h-[calc(100%+4px)] w-px bg-border" />
                      )}
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-600">
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

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  Open subjects
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {OPEN_POSITIONS.map((text) => (
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
                  "hover:border-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/5"
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      HR inquiries
                    </p>
                    <p className="mt-1 font-semibold">careers@schoolmgmt.com</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Sun – Thu, 9 AM – 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
              <div className="border-b bg-muted/40 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Teacher application</h3>
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
                    <h4 className="mt-6 text-2xl font-bold">Application received!</h4>
                    <p className="mt-3 max-w-sm text-muted-foreground">
                      Thank you for your interest. Our HR team will review your profile and contact
                      you within one week.
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
                      title="Personal information"
                      description="How we can reach you"
                    >
                      <FormField label="Full name" error={errors.full_name?.message}>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Your full name"
                            className={cn(inputClass, "pl-10")}
                            {...register("full_name")}
                          />
                        </div>
                      </FormField>

                      <div className="grid gap-4 sm:grid-cols-2">
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
                        <FormField label="Email" error={errors.email?.message}>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="email"
                              placeholder="you@email.com"
                              className={cn(inputClass, "pl-10")}
                              {...register("email")}
                            />
                          </div>
                        </FormField>
                      </div>
                    </FormSection>

                    <div className="border-t border-dashed" />

                    <FormSection
                      number="2"
                      title="Professional background"
                      description="Your teaching qualifications and expertise"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Qualification" error={errors.qualification?.message}>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="e.g. B.Ed, M.Sc"
                              className={cn(inputClass, "pl-10")}
                              {...register("qualification")}
                            />
                          </div>
                        </FormField>
                        <FormField label="Experience" error={errors.experience?.message}>
                          <Input
                            placeholder="e.g. 3 years"
                            className={inputClass}
                            {...register("experience")}
                          />
                        </FormField>
                      </div>

                      <FormField label="Subject specialization" error={errors.subject?.message}>
                        <Input
                          placeholder="e.g. Mathematics, English, Science"
                          className={inputClass}
                          {...register("subject")}
                        />
                      </FormField>
                    </FormSection>

                    <div className="border-t border-dashed" />

                    <FormSection
                      number="3"
                      title="Address"
                      description="Your current residential address"
                    >
                      <FormField label="Full address" error={errors.address?.message}>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="House / road, area, city, district"
                            rows={4}
                            className="min-h-[120px] resize-none rounded-xl border-muted-foreground/15 bg-background pl-10 pt-3 transition-colors focus-visible:ring-emerald-500/30"
                            {...register("address")}
                          />
                        </div>
                      </FormField>
                    </FormSection>

                    <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                          By submitting, you consent to us storing your application data for
                          recruitment purposes.
                        </p>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isLoading}
                          className="h-12 shrink-0 rounded-xl bg-emerald-600 px-8 font-semibold shadow-lg shadow-emerald-600/25 transition-shadow hover:bg-emerald-600/90 hover:shadow-xl hover:shadow-emerald-600/30"
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

export default TeacherApplySection;
