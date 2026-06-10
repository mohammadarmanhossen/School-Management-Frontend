"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { mockWorkloadAnalytics } from "@/lib/teacher-extended-mock";

export function TeacherWorkloadAnalytics() {
  return (
    <div className="grid gap-6">
      <Card className="dashboard-card border-white/[0.08]">
        <CardHeader>
          <CardTitle>Workload Analysis</CardTitle>
          <CardDescription>Breakdown of your weekly responsibilities</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWorkloadAnalytics} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: "8px" }}
                itemStyle={{ color: "#e4e4e7" }}
                cursor={{ fill: "#ffffff05" }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              <Bar dataKey="classes" name="Classes" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
              <Bar dataKey="labs" name="Lab Sessions" stackId="a" fill="#06b6d4" />
              <Bar dataKey="meetings" name="Meetings" stackId="a" fill="#a855f7" />
              <Bar dataKey="duties" name="Other Duties" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
