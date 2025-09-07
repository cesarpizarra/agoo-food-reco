"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReviewsChartProps {
  data: Array<{
    month: string;
    reviews: number;
  }>;
}

export function ReviewsChart({ data }: ReviewsChartProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Reviews Trend (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="reviews" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
