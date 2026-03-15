"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import ExpenseCard from "./expense-card";
import {Skeleton} from "@/components/ui/skeleton";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const data = await apiRequest("/expenses/");

      // Handle paginated or direct array response
      const expenseList = Array.isArray(data) ? data : data.results || [];

      setExpenses(expenseList);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (expenses.length === 0) {
    return <p className="text-sm text-muted-foreground">No expenses yet.</p>;
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
