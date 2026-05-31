"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/types";

interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  type: "area" | "bar" | "line";
  dataKeys: { key: string; color: string; name?: string }[];
  height?: number;
}

export function ChartCard({ title, data, type, dataKeys, height = 300 }: ChartCardProps) {
  const Chart = type === "area" ? AreaChart : type === "bar" ? BarChart : LineChart;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <Chart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            {type === "area"
              ? dataKeys.map((dk) => (
                  <Area
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    stroke={dk.color}
                    fill={dk.color}
                    fillOpacity={0.2}
                    name={dk.name || dk.key}
                  />
                ))
              : type === "bar"
              ? dataKeys.map((dk) => (
                  <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.name || dk.key} radius={[4, 4, 0, 0]} />
                ))
              : dataKeys.map((dk) => (
                  <Line
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    stroke={dk.color}
                    strokeWidth={2}
                    name={dk.name || dk.key}
                    dot={{ fill: dk.color }}
                  />
                ))}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
