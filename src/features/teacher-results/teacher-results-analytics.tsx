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
import { useResultStore } from "@/store/result-store";

export function TeacherResultsAnalytics() {
  const { results } = useResultStore();

  const gradeData = useMemo(() => {
    const counts: Record<string, number> = { "A+": 0, "A": 0, "A-": 0, "B": 0, "C": 0, "D": 0, "F": 0 };
    results.forEach(r => {
      if (counts[r.grade] !== undefined) counts[r.grade]++;
    });

    const colors: Record<string, string> = {
      "A+": "#10b981", "A": "#34d399", "A-": "#6ee7b7", 
      "B": "#3b82f6", "C": "#f59e0b", "D": "#f97316", "F": "#ef4444"
    };

    return Object.keys(counts)
      .map(grade => ({ name: grade, value: counts[grade], color: colors[grade] }))
      .filter(item => item.value > 0);
  }, [results]);

  const passFailData = useMemo(() => {
    let pass = 0;
    let fail = 0;
    results.forEach(r => {
      if (r.grade === "F") fail++;
      else pass++;
    });
    return [
      { name: "Pass", value: pass, color: "#10b981" },
      { name: "Fail", value: fail, color: "#ef4444" },
    ].filter(item => item.value > 0);
  }, [results]);

  const topStudents = useMemo(() => {
    return [...results]
      .sort((a, b) => b.marksObtained - a.marksObtained)
      .slice(0, 5);
  }, [results]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Grade Distribution */}
      <Card className="dashboard-card col-span-2">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Number of students per grade across all exams</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff05" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pass/Fail Ratio */}
      <Card className="dashboard-card col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Pass vs Fail</CardTitle>
          <CardDescription>Overall pass/fail ratio</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
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
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Students List (Takes up full width below the charts) */}
      <Card className="dashboard-card col-span-full">
        <CardHeader>
          <CardTitle>Top Performing Students</CardTitle>
          <CardDescription>Based on highest marks obtained</CardDescription>
        </CardHeader>
        <CardContent>
          {topStudents.length > 0 ? (
            <div className="space-y-4">
              {topStudents.map((student, i) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{student.studentName}</p>
                      <p className="text-xs text-zinc-400">{student.className} • {student.examName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">{student.marksObtained} / {student.totalMarks}</p>
                    <p className="text-xs text-zinc-400">Grade: {student.grade} (GPA: {student.gpa.toFixed(2)})</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-zinc-500 py-8">No results data available yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
