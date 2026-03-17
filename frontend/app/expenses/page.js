"use client";

import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseList from "@/components/expenses/expense-list";

import {Separator} from "@/components/ui/separator";

export default function ExpensesPage() {
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
        />
      </div>

      <Separator className="bg-white/10" />

      <ExpenseList />
    </div>
  );
}
