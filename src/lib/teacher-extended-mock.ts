export interface TeacherLab {
  id: string;
  labName: string;
  subject: string;
  class: string;
  section: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "upcoming" | "ongoing" | "completed";
}

export interface TeacherMeeting {
  id: string;
  title: string;
  type: "Staff" | "Parent" | "Department" | "Academic" | "Training";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: "upcoming" | "completed";
}

export interface TeacherDuty {
  id: string;
  title: string;
  type: "Exam" | "Invigilation" | "Hall Monitoring" | "Assembly" | "Library" | "Event" | "Result Processing";
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: "pending" | "completed";
}

export const mockTeacherLabs: TeacherLab[] = [
  { id: "lab-1", labName: "Physics Practical", subject: "Physics", class: "Class 10", section: "A", room: "Physics Lab 1", date: "2025-06-15", startTime: "11:00", endTime: "12:30", duration: "1h 30m", status: "upcoming" },
  { id: "lab-2", labName: "Chemistry Titration", subject: "Chemistry", class: "Class 9", section: "B", room: "Chemistry Lab", date: "2025-06-16", startTime: "09:00", endTime: "10:30", duration: "1h 30m", status: "upcoming" },
];

export const mockTeacherMeetings: TeacherMeeting[] = [
  { id: "mtg-1", title: "Monthly Staff Meeting", type: "Staff", date: "2025-06-20", startTime: "14:00", endTime: "15:00", location: "Main Conference Room", status: "upcoming" },
  { id: "mtg-2", title: "Parent-Teacher Conference", type: "Parent", date: "2025-06-25", startTime: "10:00", endTime: "13:00", location: "Auditorium", status: "upcoming" },
  { id: "mtg-3", title: "Science Dept Alignment", type: "Department", date: "2025-06-12", startTime: "15:30", endTime: "16:30", location: "Room 102", status: "completed" },
];

export const mockTeacherDuties: TeacherDuty[] = [
  { id: "duty-1", title: "Mid-Term Invigilation", type: "Invigilation", date: "2025-06-18", startTime: "09:00", endTime: "12:00", location: "Exam Hall A", status: "pending" },
  { id: "duty-2", title: "Morning Assembly", type: "Assembly", date: "2025-06-19", startTime: "07:30", endTime: "08:00", location: "Main Ground", status: "pending" },
  { id: "duty-3", title: "Result Processing", type: "Result Processing", date: "2025-06-28", startTime: "14:00", endTime: "17:00", location: "Staff Room", status: "pending" },
];

export const mockWorkloadAnalytics = [
  { name: "Week 1", classes: 18, labs: 4, meetings: 2, duties: 3 },
  { name: "Week 2", classes: 20, labs: 3, meetings: 1, duties: 2 },
  { name: "Week 3", classes: 18, labs: 4, meetings: 3, duties: 5 }, // Exam week
  { name: "Week 4", classes: 15, labs: 2, meetings: 2, duties: 8 }, // Result processing
];
