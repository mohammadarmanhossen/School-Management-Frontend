"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, CalendarDays, MapPin, Clock, Star, Users, CheckCircle2,
  FileText, Download, Share2, Calendar as CalendarIcon, Image, UserCircle
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { mockStudentActivityEvents } from "@/lib/mock-student-events";
import { toast } from "sonner";

export default function StudentEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const event = mockStudentActivityEvents.find(e => e.id === id);

  if (!mounted) return null;

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <CalendarDays className="h-16 w-16 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-zinc-400 max-w-md text-center">The event you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => router.push("/student/dashboard/events")} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
      </div>
    );
  }

  const handleRegister = () => {
    if (isRegistered) {
      toast.success("You have successfully cancelled your registration.");
      setIsRegistered(false);
    } else {
      toast.success("Registration confirmed! We've added this event to your calendar.");
      setIsRegistered(true);
    }
  };

  const handleShare = () => {
    toast.info("Link copied to clipboard!");
  };

  const handleDownload = () => {
    toast.success("Starting download...");
  };

  const fillPercentage = ((event.registeredCount + (isRegistered ? 1 : 0)) / event.capacity) * 100;

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Event Details"
        description="Detailed information, schedules, and resources for this event."
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Events", href: "/student/dashboard/events" },
          { label: event.title },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.push("/student/dashboard/events")} className="rounded-full bg-zinc-950/50 border-white/10 hover:bg-zinc-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />

      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950 h-[300px] md:h-[400px]">
          <div className="absolute inset-0">
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white border-0 text-xs md:text-sm shadow-lg">
                  {event.category}
                </Badge>
                <Badge variant="outline" className={`border-white/20 backdrop-blur-md shadow-lg ${
                  event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300' :
                  event.status === 'ongoing' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-zinc-500/20 text-zinc-300'
                }`}>
                  {event.status.toUpperCase()}
                </Badge>
                {isRegistered && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Registered
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight shadow-black/50 drop-shadow-xl">
                {event.title}
              </h1>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <Button onClick={handleShare} variant="outline" size="icon" className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-zinc-950/50 border-b border-white/10 rounded-none h-14 p-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fuchsia-500 rounded-none px-6 h-full text-base">Overview</TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fuchsia-500 rounded-none px-6 h-full text-base">Schedule</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fuchsia-500 rounded-none px-6 h-full text-base">Resources & Attachments</TabsTrigger>
              <TabsTrigger value="gallery" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fuchsia-500 rounded-none px-6 h-full text-base">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-6 outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">About the Event</h3>
                  <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {event.description}
                  </p>
                </section>

                {(event.rules && event.rules.length > 0) || event.dressCode ? (
                  <section className="bg-zinc-950/50 border border-white/[0.08] rounded-xl p-6 space-y-6">
                    {event.dressCode && (
                      <div>
                        <h4 className="text-sm uppercase tracking-wider font-bold text-zinc-500 mb-2">Dress Code</h4>
                        <p className="text-white font-medium">{event.dressCode}</p>
                      </div>
                    )}
                    {event.rules && event.rules.length > 0 && (
                      <div>
                        <h4 className="text-sm uppercase tracking-wider font-bold text-zinc-500 mb-3">Participation Rules</h4>
                        <ul className="space-y-2">
                          {event.rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start text-zinc-300">
                              <span className="h-6 flex items-center justify-center mr-3 text-fuchsia-500">•</span>
                              <span className="leading-relaxed">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ) : null}
              </motion.div>
            </TabsContent>

            <TabsContent value="schedule" className="pt-6 outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {event.schedule && event.schedule.length > 0 ? (
                  <div className="relative pl-6 md:pl-8 space-y-8 border-l border-white/10 ml-4 py-4">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[33px] md:-left-[41px] top-1 h-4 w-4 rounded-full bg-zinc-950 border-2 border-fuchsia-500" />
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="md:w-32 shrink-0 pt-0.5">
                            <span className="inline-block bg-fuchsia-500/10 text-fuchsia-400 font-bold px-3 py-1 rounded-md text-sm border border-fuchsia-500/20">
                              {item.time}
                            </span>
                          </div>
                          <div className="bg-zinc-950/50 border border-white/[0.05] rounded-xl p-5 flex-grow">
                            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                            {item.description && <p className="text-zinc-400 leading-relaxed">{item.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                    <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No schedule has been published for this event yet.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="resources" className="pt-6 outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {event.attachments && event.attachments.length > 0 ? (
                  event.attachments.map((doc, idx) => (
                    <Card key={idx} className="bg-zinc-950/50 border-white/[0.08] hover:bg-zinc-900 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                            doc.type === 'pdf' ? 'bg-red-500/10 text-red-400' :
                            doc.type === 'image' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-blue-500/10 text-blue-400'
                          }`}>
                            {doc.type === 'pdf' ? <FileText className="h-6 w-6" /> : 
                             doc.type === 'image' ? <Image className="h-6 w-6" /> : 
                             <FileText className="h-6 w-6" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{doc.name}</h4>
                            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">{doc.type} • {doc.size || "Unknown Size"}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleDownload} className="text-zinc-400 hover:text-white">
                          <Download className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                    <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No resources or attachments available for this event.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="gallery" className="pt-6 outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {event.gallery && event.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery.map((item, idx) => (
                      <div key={item.id} className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-zinc-900">
                        <img 
                          src={item.url} 
                          alt={`Gallery image ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                    <Image className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>No photos or videos have been uploaded yet.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Action Card */}
          <Card className="bg-zinc-950/80 border-white/[0.08] backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white">Participation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Available Seats</span>
                  <span className="font-bold text-white">{event.capacity - (event.registeredCount + (isRegistered ? 1 : 0))} / {event.capacity}</span>
                </div>
                <Progress value={fillPercentage} className="h-2.5 bg-zinc-800" indicatorClassName={fillPercentage > 90 ? "bg-red-500" : "bg-fuchsia-500"} />
                {fillPercentage > 90 && <p className="text-xs text-red-400 text-right mt-1">Almost Full!</p>}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-300 text-sm">
                    <CalendarIcon className="h-4 w-4" /> Deadline
                  </div>
                  <span className="font-medium text-red-400">{formatDate(event.registrationDeadline)}</span>
                </div>
              </div>

              <Button 
                onClick={handleRegister} 
                className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${
                  isRegistered 
                    ? "bg-zinc-800 hover:bg-red-900/40 text-white border border-red-500/20 hover:border-red-500/50" 
                    : "bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-fuchsia-500/25"
                }`}
              >
                {isRegistered ? "Cancel Registration" : "Register for Event"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="bg-zinc-950/50 border-white/[0.08]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-white">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{formatDate(event.date)}</p>
                  {event.endDate && <p className="text-sm text-zinc-400">to {formatDate(event.endDate)}</p>}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{event.startTime}</p>
                  <p className="text-sm text-zinc-400">until {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white leading-snug">{event.location}</p>
                  <Button variant="link" className="h-auto p-0 text-fuchsia-400 text-xs">View on Map</Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Organized by</p>
                  <p className="text-sm text-zinc-400">{event.organizer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
