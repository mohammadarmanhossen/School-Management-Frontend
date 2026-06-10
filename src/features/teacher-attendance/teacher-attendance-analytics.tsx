"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
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
import { useAttendanceStore } from "@/store/attendance-store";

const COLORS = {
  present: "#10b981",
  absent: "#ef4444",
  late: "#f59e0b",
  leave: "#3b82f6",
  half_day: "#8b5cf6",
  excused: "#6b7280"
};

export function TeacherAttendanceAnalytics() {
  const { records } = useAttendanceStore();

  const percentageData = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0, half_day: 0, excused: 0 };
    records.forEach(r => {
      if (counts[r.status as keyof typeof counts] !== undefined) {
        counts[r.status as keyof typeof counts]++;
      }
    });

    return [
      { name: "Present", value: counts.present, color: COLORS.present },
      { name: "Absent", value: counts.absent, color: COLORS.absent },
      { name: "Late", value: counts.late, color: COLORS.late },
      { name: "Leave", value: counts.leave, color: COLORS.leave },
    ].filter(item => item.value > 0);
  }, [records]);

  const trendData = useMemo(() => {
    const dates = Array.from(new Set(records.map(r => r.date))).sort();
    return dates.map(date => {
      const dayRecords = records.filter(r => r.date === date);
      const present = dayRecords.filter(r => ["present", "late", "half_day"].includes(r.status)).length;
      const rate = dayRecords.length ? (present / dayRecords.length) * 100 : 0;
      return {
        date,
        rate: Number(rate.toFixed(1))
      };
    });
  }, [records]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Attendance Trend */}
      <Card className="dashboard-card col-span-2">
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
          <CardDescription>Daily attendance percentage</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ stroke: "#ffffff0a" }}
              />
              <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance Distribution */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Overall Breakdown</CardTitle>
          <CardDescription>Distribution of statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={percentageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {percentageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
