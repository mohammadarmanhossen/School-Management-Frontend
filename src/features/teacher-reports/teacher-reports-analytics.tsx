"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  mockTeacherAttendanceChart, 
  mockTeacherMonthlyScoreTrend,
  mockTeacherSubjectBreakdown,
  mockTeacherAssignmentCompletion
} from "@/lib/mock-data";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function TeacherReportsAnalytics() {
  
  const gpaDistribution = useMemo(() => [
    { name: "A+", value: 45 },
    { name: "A", value: 30 },
    { name: "A-", value: 15 },
    { name: "B", value: 8 },
    { name: "C & Below", value: 2 }
  ], []);

  const passFailData = useMemo(() => [
    { name: "Pass", value: 94, color: "#10b981" },
    { name: "Fail", value: 6, color: "#ef4444" }
  ], []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Attendance Trend */}
      <Card className="dashboard-card col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Attendance Trend (Last 6 Months)</CardTitle>
          <CardDescription>Average student attendance in your assigned classes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTeacherAttendanceChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ stroke: "#ffffff0a" }}
              />
              <Area type="monotone" dataKey="present" name="Avg Attendance %" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPresent)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pass/Fail Ratio */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Pass/Fail Analysis</CardTitle>
          <CardDescription>Overall success rate</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(value: number) => [`${value}%`, "Rate"]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card className="dashboard-card col-span-2">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores across your subjects</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockTeacherSubjectBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="subject" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff05" }}
              />
              <Bar dataKey="avgScore" name="Avg Score %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GPA Distribution */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Overall grades in recent exams</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gpaDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={60} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff05" }}
              />
              <Bar dataKey="value" name="Students %" radius={[0, 4, 4, 0]}>
                {gpaDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Assignment Completion */}
      <Card className="dashboard-card col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Assignment Completion Rate</CardTitle>
          <CardDescription>On-time submissions across all assigned classes</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTeacherAssignmentCompletion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Line type="monotone" dataKey="submitted" name="Submission %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: "#f59e0b" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
