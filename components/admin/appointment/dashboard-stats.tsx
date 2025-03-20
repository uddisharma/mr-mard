"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";

interface DashboardStats {
  totalAppointments: number;
  totalRevenue: number;
  totalUsers: number;
  canceledAppointments: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    totalRevenue: 0,
    totalUsers: 0,
    canceledAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // We'll show zeros if we can't fetch the stats
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Appointments
          </CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.totalAppointments}
          </div>
          <p className="text-xs text-muted-foreground">Active appointments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">From all transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.totalUsers}
          </div>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Canceled Appointments
          </CardTitle>
          <XCircleIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.canceledAppointments}
          </div>
          <p className="text-xs text-muted-foreground">Total cancellations</p>
        </CardContent>
      </Card>
    </div>
  );
}
