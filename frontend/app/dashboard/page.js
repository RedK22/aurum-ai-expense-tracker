"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

import ChatContainer from "@/components/chat/chat-container";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "@/components/currency-context";

export default function DashboardPage() {
  const {currency} = useCurrency();
  const [summary, setSummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const today = new Date();

      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      const [summaryData, expensesData, subData, monthlyData] =
        await Promise.all([
          apiRequest("/analytics/category-summary/"),
          apiRequest("/expenses/"),
          apiRequest("/recurring/"),
          apiRequest(`/expenses/?from=${firstDay}&to=${lastDay}`),
        ]);

      setSummary(summaryData);

      const expenseList = Array.isArray(expensesData)
        ? expensesData
        : expensesData.results || [];

      setRecentExpenses(expenseList.slice(0, 5));

      const subs = Array.isArray(subData) ? subData : subData.results || [];
      setSubscriptions(subs);

      const monthlyList = Array.isArray(monthlyData)
        ? monthlyData
        : monthlyData.results || [];

      const total = monthlyList.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

      setMonthlyTotal(total);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = summary.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  const activeSubscriptions = subscriptions.filter((s) => s.is_active).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Monthly Spend
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-3xl font-semibold">
                {formatCurrency(monthlyTotal, currency)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold">{activeSubscriptions}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="opacity-30" />

      {/* Middle */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Expenses */}
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading &&
              Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}

            {!loading &&
              recentExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.date}</p>
                  </div>

                  <p className="font-semibold whitespace-nowrap">
                    {formatCurrency(e.amount, currency)}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex flex-col h-[400px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle>Quick AI Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1">
              <ChatContainer />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="opacity-30" />

      {/* Category Breakdown */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading &&
            Array.from({length: 5}).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded" />
            ))}

          {!loading &&
            summary.map((item) => {
              const percent =
                totalSpent > 0 ? (Number(item.total) / totalSpent) * 100 : 0;

              return (
                <div key={item.category__name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.category__name}</span>
                    <span>{formatCurrency(item.total, currency)}</span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/40 transition-all"
                      style={{width: `${percent}%`}}
                    />
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
