"use client";

import { parseData } from "@/lib/utils";
import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

type ChartDatum = Record<string, string | number | null | undefined>;

interface ChartProps {
  type: "area" | "bar" | "pie";
  data: ChartDatum[] | string;
  title: string;
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
  unit?: string;
  colors?: string[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value?: string | number }[];
  label?: ReactNode;
}

const COLORS = ["#C0A080", "#4B5563", "#846E56", "#1A1A1A", "#D1D5DB"];
const subscribeToClient = () => () => undefined;

export const ChartEngine = ({
  type,
  data,
  title,
  xKey,
  yKey,
  yLabel,
  unit = "",
  colors = COLORS
}: ChartProps) => {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  // ✅ parse data an toàn (fix MDX)
  const safeData = parseData<ChartDatum>(data);
  const mainColor = colors[0];
  // ✅ empty data
  if (!safeData.length) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  // ✅ Tooltip đẹp + ổn định
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    const firstEntry = payload[0];
    if (!firstEntry) return null;

    return (
      <div className="bg-white border border-slate-200 p-3 shadow text-sm">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium">
          {typeof firstEntry.value === "number"
            ? firstEntry.value.toLocaleString()
            : firstEntry.value}{" "}
          {unit}
        </p>
        <p className="text-xs text-gray-400">{yLabel}</p>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis
              domain={[
                (min: number) => min - 10,
                (max: number) => max + 10
              ]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={mainColor}
              fill={mainColor}
              fillOpacity={0.2}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill={mainColor} />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={safeData}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {safeData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6 border border-slate-100 shadow-sm">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-xs text-gray-400">
          {unit ? `Metric: ${unit}` : "Báo cáo thị trường"}
        </p>
      </div>

      {/* Chart container */}
      <div className="w-full h-95 min-h-75">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
