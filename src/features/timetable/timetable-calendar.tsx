"use client";

import { useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTimetableStore } from "@/store";
import { toast } from "sonner";

export function TimetableCalendar() {
  const { entries } = useTimetableStore();
  const calendarRef = useRef<FullCalendar>(null);

  // Map our TimetableEntry objects to FullCalendar Events
  const events = useMemo(() => {
    const dayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    return entries.map((e) => ({
      id: e.id,
      title: `${e.subjectName} (${e.className})`,
      startTime: e.startTime,
      endTime: e.endTime,
      daysOfWeek: [dayMap[e.day]],
      extendedProps: { ...e },
      backgroundColor: e.color?.includes("blue") ? "#3b82f6" : 
                       e.color?.includes("emerald") ? "#10b981" : 
                       e.color?.includes("purple") ? "#8b5cf6" : 
                       e.color?.includes("orange") ? "#f97316" : 
                       e.color?.includes("cyan") ? "#06b6d4" : "#4f46e5",
      borderColor: "transparent",
    }));
  }, [entries]);

  const handleEventDrop = (info: any) => {
    toast.info("Drag & drop to reschedule is disabled for recurring weekly templates.");
    info.revert();
  };

  const handleEventClick = (info: any) => {
    const props = info.event.extendedProps;
    toast(`${props.subjectName} Details`, {
      description: `Class: ${props.className} | Teacher: ${props.teacherName} | Room: ${props.room}`,
    });
  };

  return (
    <div className="dashboard-card p-4 overflow-hidden rounded-xl border border-white/[0.08]">
      <style>{`
        .fc-theme-standard td, .fc-theme-standard th, .fc-theme-standard .fc-scrollgrid { border-color: rgba(255,255,255,0.08) !important; }
        .fc .fc-toolbar-title { font-size: 1.2rem; font-weight: 600; color: white; }
        .fc .fc-button-primary { background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: white; }
        .fc .fc-button-primary:hover { background-color: rgba(255,255,255,0.1); }
        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background-color: #3b82f6; border-color: #3b82f6; }
        .fc .fc-timegrid-slot { height: 3em; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .fc-event { border-radius: 4px; padding: 2px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); cursor: pointer; }
        .fc .fc-timegrid-col.fc-day-today { background-color: rgba(59, 130, 246, 0.05) !important; }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        slotMinTime="07:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        expandRows={true}
        height="700px"
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
      />
    </div>
  );
}
