"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, MapPin, Clock, ExternalLink, Calendar as CalendarIcon, 
  Star, Trophy, Users, Bell, Filter, Search, ChevronRight, Activity
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { mockStudentActivityEvents, mockEventAnalytics } from "@/lib/mock-student-events";
import { StudentActivityEvent, EventCategory } from "@/types";

// Helper component for Countdown
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 items-center mt-6">
      <div className="flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <span className="text-xs text-fuchsia-200 mt-2 font-medium">DAYS</span>
      </div>
      <div className="text-2xl font-bold text-fuchsia-300/50">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span className="text-xs text-fuchsia-200 mt-2 font-medium">HOURS</span>
      </div>
      <div className="text-2xl font-bold text-fuchsia-300/50">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span className="text-xs text-fuchsia-200 mt-2 font-medium">MINS</span>
      </div>
      <div className="text-2xl font-bold text-fuchsia-300/50">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <span className="text-xs text-fuchsia-200 mt-2 font-medium">SECS</span>
      </div>
    </div>
  );
};

export default function EventsActivitiesCenter() {
  const [activeCategory, setActiveCategory] = useState<"All" | EventCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredEvent = mockStudentActivityEvents[0];
  const allEvents = mockStudentActivityEvents.slice(1);
  
  const categories = ["All", ...Array.from(new Set(mockStudentActivityEvents.map(e => e.category)))];

  const filteredEvents = allEvents.filter(evt => {
    const matchesCategory = activeCategory === "All" || evt.category === activeCategory;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Events & Activities Center"
        description="Discover events, register, track participation, and stay engaged with school activities."
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Events & Activities" },
        ]}
      />

      {/* Featured Event Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-2xl group min-h-[450px] flex flex-col justify-end">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0">
            <img 
              src={featuredEvent.coverImage} 
              alt={featuredEvent.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-fuchsia-900/20 mix-blend-multiply" />
          </div>

          <CardContent className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-0 px-3 py-1 text-sm uppercase tracking-wider font-bold">
                  <Star className="mr-1.5 h-3.5 w-3.5 inline-block" /> Featured Event
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1 text-sm uppercase tracking-wider font-semibold">
                  {featuredEvent.category}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {featuredEvent.title}
              </h1>
              
              <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                {featuredEvent.description.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                  <CalendarDays className="h-4 w-4 text-fuchsia-400" />
                  {formatDate(featuredEvent.date)}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                  <Clock className="h-4 w-4 text-fuchsia-400" />
                  {featuredEvent.startTime}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                  <MapPin className="h-4 w-4 text-fuchsia-400" />
                  {featuredEvent.location}
                </div>
              </div>

              {/* Countdown Timer */}
              <CountdownTimer targetDate={featuredEvent.date} />
            </div>

            <div className="shrink-0 flex flex-col items-center md:items-end gap-4 w-full md:w-auto mt-6 md:mt-0">
              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex justify-between w-full text-sm text-zinc-300">
                  <span>Seats Filling Fast!</span>
                  <span className="font-bold text-white">{featuredEvent.capacity - featuredEvent.registeredCount} Left</span>
                </div>
                <Progress 
                  value={(featuredEvent.registeredCount / featuredEvent.capacity) * 100} 
                  className="h-2 w-full md:w-64 bg-white/20" 
                  indicatorClassName="bg-fuchsia-500" 
                />
              </div>
              <Link href={`/student/dashboard/events/${featuredEvent.id}`} className="w-full">
                <Button className="w-full rounded-full bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] px-8 py-6 text-lg font-bold group transition-all">
                  View Details & Register
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics & Overview Widgets */}
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-900/10 border-indigo-500/20 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Registered Events</p>
                  <p className="text-2xl font-bold text-white">{mockEventAnalytics.totalRegistered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-emerald-500/20 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Completed Events</p>
                  <p className="text-2xl font-bold text-white">{mockEventAnalytics.completedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="md:col-span-2">
          <Card className="bg-zinc-950/50 border-white/[0.08] shadow-none h-full">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Stay Updated!</h3>
                <p className="text-sm text-zinc-400">You have {mockEventAnalytics.upcomingEvents} upcoming events this month.</p>
              </div>
              <Button variant="outline" className="rounded-full border-zinc-700 hover:bg-zinc-800">
                <CalendarIcon className="mr-2 h-4 w-4" /> View Calendar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Events Browsing Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Explore Activities</h2>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search events..." 
                className="pl-9 bg-zinc-950/50 border-white/[0.08]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 bg-zinc-950/50 border-white/[0.08]">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories Tabs */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`rounded-full px-6 transition-all ${
                  activeCategory === category 
                    ? "bg-fuchsia-600 hover:bg-fuchsia-700 text-white border-fuchsia-600 shadow-md shadow-fuchsia-500/20" 
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
                onClick={() => setActiveCategory(category as any)}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt, index) => (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="relative overflow-hidden border-white/[0.08] bg-zinc-950/50 hover:bg-zinc-900/80 hover:border-fuchsia-500/30 transition-all duration-300 group flex flex-col h-full">
                    {/* Cover Image */}
                    <div className="h-48 w-full relative overflow-hidden">
                      <img 
                        src={evt.coverImage} 
                        alt={evt.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-zinc-900/80 backdrop-blur-md text-white border-white/10 shadow-lg">
                          {evt.category}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant={evt.status === "upcoming" ? "default" : evt.status === "ongoing" ? "success" : "secondary"} className="shadow-lg backdrop-blur-md">
                          {evt.status}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-fuchsia-400 transition-colors">{evt.title}</h4>
                      
                      <div className="space-y-3 mt-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                          <CalendarDays className="h-4 w-4 text-fuchsia-500 shrink-0" />
                          <span>{formatDate(evt.date)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                          <Clock className="h-4 w-4 text-fuchsia-500 shrink-0" />
                          <span>{evt.startTime} - {evt.endTime}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                          <MapPin className="h-4 w-4 text-fuchsia-500 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                          <Users className="h-4 w-4 text-fuchsia-500 shrink-0" />
                          <span className="truncate">By {evt.organizer}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/[0.08] space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400">Available Seats: <strong className="text-white">{evt.capacity - evt.registeredCount}</strong> / {evt.capacity}</span>
                          <span className="text-zinc-400">Deadline: <strong className="text-red-400">{formatDate(evt.registrationDeadline)}</strong></span>
                        </div>
                        <Link href={`/student/dashboard/events/${evt.id}`}>
                          <Button className="w-full bg-zinc-800 hover:bg-fuchsia-600 text-white transition-colors group-hover:bg-fuchsia-600">
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                <CalendarDays className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-1">No events found</h3>
                <p className="text-zinc-400">Try adjusting your category filter or search query.</p>
                <Button variant="link" className="text-fuchsia-400 mt-2" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
