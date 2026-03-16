"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";

import ExpenseCard from "./expense-card";

import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, [search, category, dateRange, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await apiRequest("/categories/");
      const categoryList = Array.isArray(data) ? data : data.results || [];
      setCategories(categoryList);
    } catch {
      console.error("Failed to load categories");
    }
  }

  async function fetchExpenses() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", page);

      if (search) params.append("q", search);

      if (category !== "all") {
        params.append("category", category);
      }

      if (dateRange.from) {
        params.append("from", dateRange.from.toISOString().split("T")[0]);
      }

      if (dateRange.to) {
        params.append("to", dateRange.to.toISOString().split("T")[0]);
      }

      const data = await apiRequest(`/expenses/?${params.toString()}`);

      const expenseList = data.results || [];

      setExpenses(expenseList);
      setNextPage(data.next);
      setPrevPage(data.previous);

      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setDateRange({from: undefined, to: undefined});
    setPage(1);
  }

  function formatRange() {
    if (!dateRange.from) return "Date range";

    if (!dateRange.to) return dateRange.from.toDateString();

    return `${dateRange.from.toLocaleDateString()} → ${dateRange.to.toLocaleDateString()}`;
  }

  /* ---------- LOCAL STATE UPDATES ---------- */

  function handleDeletedExpense(id) {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }

  function handleUpdatedExpense(updatedExpense) {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)),
    );
  }

  function handleCreatedExpense(newExpense) {
    setExpenses((prev) => [newExpense, ...prev]);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-[200px]"
        />

        <Select
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>

            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{formatRange()}</Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setPage(1);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {/* Error */}
      {!loading && error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty */}
      {!loading && !error && expenses.length === 0 && (
        <p className="text-sm text-muted-foreground">No expenses found.</p>
      )}

      {/* Expense list */}
      {!loading && !error && expenses.length > 0 && (
        <>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDeleted={handleDeletedExpense}
                onUpdated={handleUpdatedExpense}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              disabled={!prevPage}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Button
              variant="outline"
              disabled={!nextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
