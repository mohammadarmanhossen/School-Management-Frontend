export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    charts: ["dashboard", "charts"] as const,
  },
  students: {
    all: ["students"] as const,
    list: (params?: Record<string, unknown>) => ["students", "list", params] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
  teachers: {
    all: ["teachers"] as const,
    list: (params?: Record<string, unknown>) => ["teachers", "list", params] as const,
    detail: (id: string) => ["teachers", "detail", id] as const,
  },
  classes: {
    all: ["classes"] as const,
    list: (params?: Record<string, unknown>) => ["classes", "list", params] as const,
    detail: (id: string) => ["classes", "detail", id] as const,
    sections: (classId?: string) => ["classes", "sections", classId] as const,
  },
  subjects: {
    all: ["subjects"] as const,
    list: (params?: Record<string, unknown>) => ["subjects", "list", params] as const,
  },
  attendance: {
    all: ["attendance"] as const,
    daily: (params?: Record<string, unknown>) => ["attendance", "daily", params] as const,
    monthly: (params?: Record<string, unknown>) => ["attendance", "monthly", params] as const,
  },
  exams: {
    all: ["exams"] as const,
    list: (params?: Record<string, unknown>) => ["exams", "list", params] as const,
    detail: (id: string) => ["exams", "detail", id] as const,
  },
  results: {
    all: ["results"] as const,
    list: (params?: Record<string, unknown>) => ["results", "list", params] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    list: (params?: Record<string, unknown>) => ["assignments", "list", params] as const,
  },
  fees: {
    all: ["fees"] as const,
    list: (params?: Record<string, unknown>) => ["fees", "list", params] as const,
  },
  notices: {
    all: ["notices"] as const,
    list: (params?: Record<string, unknown>) => ["notices", "list", params] as const,
  },
  library: {
    all: ["library"] as const,
    dashboard: ["library", "dashboard"] as const,
    books: (params?: Record<string, unknown>) => ["library", "books", params] as const,
    issues: (params?: Record<string, unknown>) => ["library", "issues", params] as const,
    members: (params?: Record<string, unknown>) => ["library", "members", params] as const,
    fines: (params?: Record<string, unknown>) => ["library", "fines", params] as const,
  },
  menus: {
    all: ["menus"] as const,
  },
  transport: {
    all: ["transport"] as const,
    vehicles: (params?: Record<string, unknown>) => ["transport", "vehicles", params] as const,
  },
  timetable: {
    all: ["timetable"] as const,
    weekly: (params?: Record<string, unknown>) => ["timetable", "weekly", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unread: ["notifications", "unread"] as const,
  },
  settings: {
    school: ["settings", "school"] as const,
    profile: ["settings", "profile"] as const,
  },
  admissions: {
    all: ["admissions"] as const,
    students: () => ["admissions", "students"] as const,
    teachers: () => ["admissions", "teachers"] as const,
  },
} as const;
