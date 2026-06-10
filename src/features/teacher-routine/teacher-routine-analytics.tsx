"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTimetableStore } from "@/store";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];
const CURRENT_TEACHER_ID = "teacher-1"; // Mohammad Karim

export function TeacherRoutineAnalytics() {
  const { getTeacherSchedule } = useTimetableStore();
  const entries = getTeacherSchedule(CURRENT_TEACHER_ID);

  // Compute Class Distribution
  const classData = useMemo(() => {
    const classes: Record<string, number> = {};
    entries.forEach((e) => {
      classes[e.className] = (classes[e.className] || 0) + 1;
    });

    return Object.entries(classes)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  // Compute Subject Distribution
  const subjectData = useMemo(() => {
    const subjects: Record<string, number> = {};
    entries.forEach((e) => {
      subjects[e.subjectName] = (subjects[e.subjectName] || 0) + 1;
    });

    return Object.entries(subjects)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [entries]);

  // Compute Daily Workload
  const dailyWorkload = useMemo(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const workload: Record<string, number> = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0 };
    
    entries.forEach((e) => {
      if (workload[e.day] !== undefined) {
        const start = new Date(`1970-01-01T${e.startTime}:00`);
        const end = new Date(`1970-01-01T${e.endTime}:00`);
        const diffHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        workload[e.day] += diffHrs;
      }
    });

    return days.map(day => ({ name: day.substring(0, 3), hours: Number(workload[day].toFixed(1)) }));
  }, [entries]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Daily Workload Analysis */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Daily Teaching Hours</CardTitle>
          <CardDescription>Hours scheduled per day</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff0a" }}
              />
              <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Class Distribution */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Class Distribution</CardTitle>
          <CardDescription>Sessions per class</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {classData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Subject Distribution</CardTitle>
          <CardDescription>Sessions per subject</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
