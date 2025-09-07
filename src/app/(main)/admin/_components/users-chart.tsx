"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface UsersChartProps {
  data: Array<{
    month: string;
    users: number;
  }>;
}

export function UsersChart({ data }: UsersChartProps) {
  return (
    <div className="rounded-lg border bg-card p-6 md:col-span-2">
      <h3 className="text-lg font-semibold mb-4">User Registrations Trend (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
