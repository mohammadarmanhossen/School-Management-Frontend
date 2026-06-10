import { StudentActivityEvent, ChartDataPoint, Notification } from "@/types";

export const mockStudentActivityEvents: StudentActivityEvent[] = [
  {
    id: "evt-tech-fest-2026",
    title: "National Tech Innovation Fest 2026",
    description: "Join the biggest technology and innovation festival of the year. Showcase your projects, participate in coding hackathons, robotics challenges, and attend workshops led by industry experts. This is your chance to shine and win exciting prizes!",
    category: "Science Fair",
    date: "2026-08-15",
    endDate: "2026-08-16",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "Main Auditorium & Innovation Labs",
    organizer: "Computer Science Department",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    status: "upcoming",
    registrationDeadline: "2026-08-10",
    capacity: 500,
    registeredCount: 342,
    dressCode: "School Uniform or Formal Casuals",
    rules: [
      "All participants must carry their student ID cards.",
      "Project submissions must be registered before August 5.",
      "No outside food or drinks allowed in the auditorium.",
      "Decisions of the judges in all competitions will be final."
    ],
    schedule: [
      { time: "09:00 AM", title: "Registration & Welcome Kit Distribution", description: "Collect your badges and event map at the front desk." },
      { time: "10:00 AM", title: "Inauguration Ceremony", description: "Opening speech by the Principal and Chief Guest." },
      { time: "11:00 AM", title: "Project Exhibition Begins", description: "All lab floors open for project demonstrations." },
      { time: "01:00 PM", title: "Lunch Break", description: "Catered lunch at the school cafeteria." },
      { time: "02:00 PM", title: "Hackathon & Robotics Challenge", description: "Live competitions in the main hall." },
      { time: "04:30 PM", title: "Day 1 Closing & Networking", description: "Interact with judges and alumni." }
    ],
    attachments: [
      { name: "Event Brochure & Schedule", type: "pdf", url: "#", size: "2.4 MB" },
      { name: "Hackathon Guidelines", type: "pdf", url: "#", size: "1.1 MB" },
      { name: "Official Poster", type: "image", url: "#", size: "5.0 MB" }
    ],
    gallery: [
      { id: "g1", type: "image", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000&auto=format&fit=crop" },
      { id: "g2", type: "image", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop" },
      { id: "g3", type: "image", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop" }
    ]
  },
  {
    id: "evt-sports-meet-2026",
    title: "Annual Athletics & Sports Meet",
    description: "Get ready for a day full of energy, competition, and sportsmanship. Participate in track and field events, relay races, and team sports. Register early to secure your spot in your favorite events.",
    category: "Sports",
    date: "2026-07-20",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    location: "School Sports Ground",
    organizer: "Physical Education Department",
    coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop",
    status: "upcoming",
    registrationDeadline: "2026-07-15",
    capacity: 1000,
    registeredCount: 850,
    dressCode: "House Sports Uniform and proper athletic shoes",
    rules: [
      "A student can participate in a maximum of 3 individual events.",
      "Reporting time for all athletes is 07:30 AM strictly.",
      "Medical fitness certificate is required for long-distance runs."
    ],
    schedule: [
      { time: "08:00 AM", title: "March Past & Torch Lighting" },
      { time: "09:00 AM", title: "Track Events (100m, 200m, 400m)" },
      { time: "11:30 AM", title: "Field Events (Long Jump, High Jump)" },
      { time: "01:00 PM", title: "Lunch Break" },
      { time: "02:00 PM", title: "Team Events Finals (Relay, Tug of War)" },
      { time: "03:30 PM", title: "Medal Distribution & Closing Ceremony" }
    ],
    attachments: [
      { name: "Sports Meet Rulebook", type: "pdf", url: "#", size: "1.5 MB" }
    ],
    gallery: []
  },
  {
    id: "evt-cultural-night",
    title: "Cultural Diversity Night",
    description: "Celebrate the rich cultural heritage of our diverse student body. The evening will feature traditional dances, musical performances, drama, and an international food festival.",
    category: "Cultural",
    date: "2026-06-25",
    startTime: "05:00 PM",
    endTime: "09:00 PM",
    location: "Open Air Theater",
    organizer: "Arts & Culture Club",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
    status: "ongoing",
    registrationDeadline: "2026-06-20",
    capacity: 600,
    registeredCount: 600,
    dressCode: "Traditional / Ethnic Wear",
    rules: [
      "Performers must report backstage 1 hour before the event.",
      "Food stalls require separate pre-registration."
    ],
    schedule: [
      { time: "05:00 PM", title: "Opening Musical Performance" },
      { time: "06:00 PM", title: "Traditional Dance Showcase" },
      { time: "07:30 PM", title: "Drama Presentation" },
      { time: "08:15 PM", title: "Food Festival Opens" }
    ],
    attachments: [],
    gallery: []
  },
  {
    id: "evt-debate-competition",
    title: "Inter-School Debate Championship",
    description: "A battle of wits and words. Watch our top debaters take on neighboring schools on topics ranging from technology ethics to global warming.",
    category: "Debate",
    date: "2026-05-10",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    location: "Seminar Hall A",
    organizer: "Debate Society",
    coverImage: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1973&auto=format&fit=crop",
    status: "completed",
    registrationDeadline: "2026-05-01",
    capacity: 200,
    registeredCount: 200,
    dressCode: "School Formal Uniform",
    rules: [],
    schedule: [],
    attachments: [],
    gallery: [
      { id: "gd1", type: "image", url: "https://images.unsplash.com/photo-1475721025505-c315f40f2ee7?q=80&w=2070&auto=format&fit=crop" }
    ]
  },
  {
    id: "evt-career-workshop",
    title: "Future Careers & College Prep Workshop",
    description: "Guidance counselors and guest speakers from top universities will provide insights on college applications, SAT preps, and emerging career fields.",
    category: "Workshop",
    date: "2026-08-05",
    startTime: "11:00 AM",
    endTime: "01:30 PM",
    location: "Library Conference Room",
    organizer: "Counseling Department",
    coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    status: "upcoming",
    registrationDeadline: "2026-08-04",
    capacity: 100,
    registeredCount: 65,
    dressCode: "Casuals",
    rules: [],
    schedule: [],
    attachments: [
      { name: "Workshop Outline", type: "pdf", url: "#", size: "800 KB" }
    ],
    gallery: []
  }
];

export const mockEventAnalytics = {
  totalRegistered: 12,
  completedEvents: 8,
  upcomingEvents: 4,
  achievements: 3,
  categoryBreakdown: [
    { name: "Academic", count: 5 },
    { name: "Sports", count: 2 },
    { name: "Cultural", count: 3 },
    { name: "Workshops", count: 2 }
  ] as { name: string; count: number }[]
};

export const mockEventNotifications: Notification[] = [
  {
    id: "en-1",
    title: "Registration Closing Soon",
    message: "Registration for Annual Athletics Meet closes in 2 days.",
    type: "warning",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "en-2",
    title: "Schedule Updated",
    message: "The timing for the Future Careers Workshop has been changed to 11:00 AM.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "en-3",
    title: "Registration Confirmed",
    message: "You have successfully registered for the National Tech Innovation Fest 2026.",
    type: "success",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
