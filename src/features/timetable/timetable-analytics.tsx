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

export function TimetableAnalytics() {
  const entries = useTimetableStore((state) => state.entries);

  // Compute Workload Analysis (Teaching Hours per Teacher)
  const workloadData = useMemo(() => {
    const workload: Record<string, number> = {};
    entries.forEach((e) => {
      const start = new Date(`1970-01-01T${e.startTime}:00`);
      const end = new Date(`1970-01-01T${e.endTime}:00`);
      const diffHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      const teacher = e.teacherName || "Unassigned";
      workload[teacher] = (workload[teacher] || 0) + diffHrs;
    });

    return Object.entries(workload)
      .map(([name, hours]) => ({ name, hours: Number(hours.toFixed(1)) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5); // Top 5
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

  // Compute Room Utilization
  const roomData = useMemo(() => {
    const rooms: Record<string, number> = {};
    entries.forEach((e) => {
      const room = e.room || "Unassigned";
      rooms[room] = (rooms[room] || 0) + 1;
    });

    return Object.entries(rooms)
      .map(([name, count]) => ({ name, classes: count }))
      .sort((a, b) => b.classes - a.classes)
      .slice(0, 5); // Top 5
  }, [entries]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Workload Analysis */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Teacher Workload</CardTitle>
          <CardDescription>Top 5 teachers by weekly hours</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff0a" }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Subject Distribution</CardTitle>
          <CardDescription>Classes per subject</CardDescription>
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

      {/* Room Utilization */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Room Utilization</CardTitle>
          <CardDescription>Top 5 busiest rooms</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff0a" }}
              />
              <Bar dataKey="classes" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
