"use client";

import ExpenseForm from "@/components/expenses/expense-form";
import ExpenseList from "@/components/expenses/expense-list";

import {Separator} from "@/components/ui/separator";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      <ExpenseForm modal triggerLabel={"Create Expense"} buttonLabel={"Add"} />

      <Separator />

      <ExpenseList />
    </div>
  );
}
