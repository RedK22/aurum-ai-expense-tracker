"use client";

import {useState} from "react";

import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseList from "@/components/expenses/expense-list";

import {Separator} from "@/components/ui/separator";

export default function ExpensesPage() {
  const [newExpense, setNewExpense] = useState(null); // 🔥 shared state

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your spending
          </p>
        </div>

        <ExpenseForm
          modal
          triggerLabel={"Create Expense"}
          buttonLabel={"Add"}
          onCreated={(expense) => setNewExpense(expense)} // 🔥 connect
        />
      </div>

      <Separator className="bg-white/10" />

      <ExpenseList externalNewExpense={newExpense} /> {/* 🔥 pass down */}
    </div>
  );
}