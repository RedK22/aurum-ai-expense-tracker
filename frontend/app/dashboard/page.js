"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

import ChatContainer from "@/components/chat/chat-container";
import ChatInput from "@/components/chat/chat-input";

import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

export default function DashboardPage() {
  const [summary, setSummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [summaryData, expensesData, subData] = await Promise.all([
        apiRequest("/analytics/category-summary/"),
        apiRequest("/expenses/"),
        apiRequest("/recurring/"),
      ]);

      setSummary(summaryData);

      const expenseList = Array.isArray(expensesData)
        ? expensesData
        : expensesData.results || [];

      setRecentExpenses(expenseList.slice(0, 5));

      const subs = Array.isArray(subData) ? subData : subData.results || [];

      setSubscriptions(subs);
    } finally {
      setLoading(false);
    }
  }

  const totalSpent = summary.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  const pieData = summary.map((item) => ({
    name: item.category__name,
    value: Number(item.total),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold">{subscriptions.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Middle section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading &&
              Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}

            {!loading &&
              recentExpenses.map((e) => (
                <div key={e.id} className="flex justify-between text-sm">
                  <span>{e.title}</span>
                  <span className="font-medium">₹{e.amount}</span>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex flex-col h-[350px]">
          <CardHeader>
            <CardTitle>Quick Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 overflow-hidden gap-3">
            <div className="flex-1 overflow-y-auto">
              <ChatContainer />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>

        <CardContent className="h-[300px]">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
