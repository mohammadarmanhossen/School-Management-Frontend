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
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit us",
    lines: ["123 Education Road, Dhanmondi", "Dhaka 1205, Bangladesh"],
  },
  {
    icon: Phone,
    title: "Call us",
    lines: ["+880 1234-567890", "+880 9876-543210"],
  },
  {
    icon: Mail,
    title: "Email us",
    lines: ["info@schoolmgmt.com", "support@schoolmgmt.com"],
  },
  {
    icon: Clock,
    title: "Working hours",
    lines: ["Sun – Thu: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 4:00 PM"],
  },
];

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
    setIsLoading(false);
  };

  return (
    <section id="contact" className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Contact</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch with us
          </h2>
          <p className="mt-4 text-muted-foreground">
            Have questions about our platform? Our team is ready to help your school get started.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          {/* Contact info cards */}
          <div className="space-y-4 lg:col-span-2">
            {CONTACT_INFO.map((item) => (
              <Card key={item.title} className="glass-card border-0">
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="overflow-hidden border-0">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-blue-600/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 text-sm font-medium">Dhaka, Bangladesh</p>
                    <p className="text-xs text-muted-foreground">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact form */}
          <Card className="glass-card lg:col-span-3">
            <CardContent className="pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Send us a message</h3>
                  <p className="text-sm text-muted-foreground">We typically reply within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" placeholder="Your name" {...register("name")} />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" placeholder="01XXXXXXXXX" {...register("phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" {...register("subject")} />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your school and requirements..."
                    rows={5}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" className="h-11 w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
