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
    <div className="dashboard-card overflow-hidden">
      <div className="border-b border-white/[0.06] px-6 py-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4 pt-2">
        <ResponsiveContainer width="100%" height={height}>
          <Chart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "hsl(0 0% 100% / 0.06)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid hsl(0 0% 100% / 0.08)",
                borderRadius: "10px",
                color: "#fafafa",
              }}
            />
            <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
            {type === "area"
              ? dataKeys.map((dk) => (
                  <Area
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    stroke={dk.color}
                    fill={dk.color}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name={dk.name || dk.key}
                  />
                ))
              : type === "bar"
              ? dataKeys.map((dk) => (
                  <Bar
                    key={dk.key}
                    dataKey={dk.key}
                    fill={dk.color}
                    name={dk.name || dk.key}
                    radius={[6, 6, 0, 0]}
                    opacity={0.85}
                  />
                ))
              : dataKeys.map((dk) => (
                  <Line
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    stroke={dk.color}
                    strokeWidth={2}
                    name={dk.name || dk.key}
                    dot={{ fill: dk.color, strokeWidth: 0, r: 4 }}
                  />
                ))}
          </Chart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
