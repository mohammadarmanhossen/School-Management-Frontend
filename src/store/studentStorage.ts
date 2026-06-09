const KEY = "school_students";

export function getStudents() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function addStudent(student: Record<string, unknown>) {
  const existing = getStudents();

  const updated = [
    { ...student, id: Date.now().toString() },
    ...existing,
  ];

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStudent(id: string) {
  const existing = getStudents();
  const updated = existing.filter((s: { id: string }) => s.id !== id);

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}