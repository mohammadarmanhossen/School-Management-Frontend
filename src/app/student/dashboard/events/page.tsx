"use client";

import { CalendarDays, MapPin, Clock, ExternalLink, Calendar as CalendarIcon, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockStudentNotices } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

// Generate some mock events based on notices + additions
const events = [
  ...mockStudentNotices.map((n, i) => ({
    id: n.id,
    title: n.title,
    date: n.date,
    time: "10:00 AM",
    location: "Main Auditorium",
    category: i === 0 ? "Sports" : "Academic",
    priority: n.priority,
    description: n.title + ". Please ensure you are present.",
  })),
  {
    id: "evt-new-1",
    title: "Science Fair 2025",
    date: "2025-07-15",
    time: "09:00 AM",
    location: "Campus Ground",
    category: "Extracurricular",
    priority: "medium",
    description: "Annual science fair where students showcase their projects.",
  }
];

export default function StudentEventsPage() {
  const upcomingEvent = events[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="School Events"
        description="Discover and manage your upcoming activities and events"
        breadcrumbs={[
          { label: "Student Portal", href: "/student/dashboard" },
          { label: "Events" },
        ]}
      />

      {/* Featured Event Hero */}
      <Card className="relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-fuchsia-600/20 via-zinc-950 to-zinc-950 group">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl transition-all duration-700 group-hover:bg-fuchsia-500/20" />
        <CardContent className="p-8 relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="outline" className="bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20">
              <Star className="mr-1 h-3 w-3" /> Featured Event
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white">{upcomingEvent.title}</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Join us for the most anticipated event of the month! {upcomingEvent.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full">
                <CalendarDays className="h-4 w-4 text-fuchsia-400" />
                {formatDate(upcomingEvent.date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4 text-fuchsia-400" />
                {upcomingEvent.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full">
                <MapPin className="h-4 w-4 text-fuchsia-400" />
                {upcomingEvent.location}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <Button className="rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg shadow-fuchsia-500/25 px-8 py-6 text-lg">
              Register Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Upcoming Calendar</h3>
          <Button variant="outline" size="sm" className="rounded-full">
            <CalendarIcon className="mr-2 h-4 w-4" /> View Full Calendar
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((evt) => (
            <Card key={evt.id} className="relative overflow-hidden border-white/[0.08] bg-zinc-950/50 transition-all duration-300 hover:border-fuchsia-500/30 hover:bg-zinc-900/80 hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={evt.priority === "high" ? "destructive" : "secondary"} className="capitalize">
                    {evt.category}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <h4 className="text-lg font-bold text-zinc-100 mb-2 line-clamp-1">{evt.title}</h4>
                <p className="text-sm text-zinc-400 mb-6 line-clamp-2">{evt.description}</p>
                
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <CalendarDays className="h-4 w-4 text-fuchsia-500" />
                    <span>{formatDate(evt.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Clock className="h-4 w-4 text-fuchsia-500" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <MapPin className="h-4 w-4 text-fuchsia-500" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
