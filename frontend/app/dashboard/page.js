"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Separator} from "@/components/ui/separator";

import ChatContainer from "@/components/chat/chat-container";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "@/components/currency-context";

// ─── helpers ────────────────────────────────────────────────────────────────

function getDateRange(filter) {
  const today = new Date();
  const toDate = today.toLocaleDateString("en-CA");

  if (filter === "all") return {from: null, to: null};

  let from;
  if (filter === "1m") {
    from = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (filter === "3m") {
    from = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  } else if (filter === "6m") {
    from = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  } else if (filter === "1y") {
    from = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
  }

  return {from: from.toLocaleDateString("en-CA"), to: toDate};
}

const FILTERS = [
  {key: "1m", label: "This month"},
  {key: "3m", label: "3 months"},
  {key: "6m", label: "6 months"},
  {key: "1y", label: "1 year"},
  {key: "all", label: "All time"},
];

// ─── component ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const {currency} = useCurrency();

  const [summary, setSummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("1m");
  const [viewMode, setViewMode] = useState("amount");

  // ── initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const today = new Date();
      const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ).toLocaleDateString("en-CA");

      const [summaryData, expensesData, subData] = await Promise.all([
        apiRequest(`/analytics/category-summary/?from=${firstDay}`),
        apiRequest("/expenses/"),
        apiRequest("/recurring/"),
      ]);

      setSummary(summaryData);

      const total = summaryData.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      );
      setMonthlyTotal(total);
      setCategorySummary(summaryData);

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

  // ── reload category section on filter change ──────────────────────────────
  useEffect(() => {
    if (loading) return;
    loadCategorySummary();
  }, [categoryFilter]);

  async function loadCategorySummary() {
    setCategoryLoading(true);
    try {
      const {from, to} = getDateRange(categoryFilter);
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const data = await apiRequest(
        `/analytics/category-summary/?${params.toString()}`,
      );
      setCategorySummary(Array.isArray(data) ? data : []);
    } finally {
      setCategoryLoading(false);
    }
  }

  // ── handle expense created from AI chat ───────────────────────────────────
  function handleExpenseCreated(expense) {
    // prepend to recent transactions, keep max 5
    setRecentExpenses((prev) => [expense, ...prev].slice(0, 5));

    // update monthly total only if the expense falls in the current month
    const today = new Date();
    const expenseDate = new Date(expense.date);
    const isThisMonth =
      expenseDate.getFullYear() === today.getFullYear() &&
      expenseDate.getMonth() === today.getMonth();

    if (isThisMonth) {
      setMonthlyTotal((prev) => prev + Number(expense.amount));
    }

    // refresh category section so bars stay accurate
    loadCategorySummary();
  }

  // ── derived values ────────────────────────────────────────────────────────
  const activeSubscriptions = subscriptions.filter((s) => s.is_active).length;

  const categoryTotal = categorySummary.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  const sortedSummary = [...categorySummary].sort(
    (a, b) => Number(b.total) - Number(a.total),
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      {/* ── top summary cards ── */}
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

      {/* ── recent transactions + AI chat ── */}
      <div className="grid gap-6 lg:grid-cols-2">
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

        <Card className="flex flex-col h-[400px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle>Quick AI Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1">
              <ChatContainer onExpenseCreated={handleExpenseCreated} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="opacity-30" />

      {/* ── spending by category ── */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Spending by Category</CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              {/* time filter pills */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                {FILTERS.map(({key, label}) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      categoryFilter === key
                        ? "bg-white/20 text-white"
                        : "text-muted-foreground hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* amount / percent toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                {["amount", "percent"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      viewMode === mode
                        ? "bg-white/20 text-white"
                        : "text-muted-foreground hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {mode === "amount" ? "Amount" : "%"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {(loading || categoryLoading) &&
            Array.from({length: 5}).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded" />
            ))}

          {!loading && !categoryLoading && sortedSummary.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No expenses found for this period.
            </p>
          )}

          {!loading &&
            !categoryLoading &&
            sortedSummary.map((item) => {
              const percent =
                categoryTotal > 0
                  ? (Number(item.total) / categoryTotal) * 100
                  : 0;

              return (
                <div key={item.category__name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.category__name}</span>
                    <span className="font-medium tabular-nums">
                      {viewMode === "amount"
                        ? formatCurrency(item.total, currency)
                        : `${percent.toFixed(1)}%`}
                    </span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/40 transition-all duration-500"
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
