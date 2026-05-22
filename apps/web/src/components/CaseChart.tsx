"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0f2744", "#b8956b", "#6b6560", "#3d5a80"];

export function PvBarChart({
  data,
}: {
  data: { name: string; pv: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d9" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#6b6560", fontSize: 12 }} />
        <YAxis
          tick={{ fill: "#6b6560", fontSize: 11 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v: number) => [
            new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v),
            "Present Value",
          ]}
          contentStyle={{ border: "1px solid #e8e2d9", borderRadius: 2 }}
        />
        <Bar dataKey="pv" radius={[2, 2, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MacroSparkline({
  data,
  color = "#0f2744",
}: {
  data: { date: string; value: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CashFlowChart({
  data,
}: {
  data: { period: number; cf: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d9" vertical={false} />
        <XAxis dataKey="period" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="cf" fill="#0f2744" />
      </BarChart>
    </ResponsiveContainer>
  );
}
