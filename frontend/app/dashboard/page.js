"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

export default function DashboardPage() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      const data = await apiRequest("/analytics/category-summary/");
      setSummary(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = summary.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Total Expense Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className="text-3xl font-semibold">₹{totalSpent}</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Category Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({length: 3}).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}

        {!loading &&
          summary.map((item) => (
            <Card key={item.category}>
              <CardHeader>
                <CardTitle className="text-base">{item.category}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-xl font-semibold">₹{item.total}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
