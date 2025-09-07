"use client";

import { ReviewsChart } from "./reviews-chart";
import { StatusChart } from "./status-chart";
import { UsersChart } from "./users-chart";

interface ChartsSectionProps {
  reviewsData: Array<{
    month: string;
    reviews: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
  usersData: Array<{
    month: string;
    users: number;
  }>;
}

export function ChartsSection({ reviewsData, statusData, usersData }: ChartsSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ReviewsChart data={reviewsData} />
      <StatusChart data={statusData} />
      <UsersChart data={usersData} />
    </div>
  );
}
