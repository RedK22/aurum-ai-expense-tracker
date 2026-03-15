"use client";

import {Card, CardContent} from "@/components/ui/card";

import EditExpenseDialog from "./edit-expense-dialog";
import DeleteExpenseDialog from "./delete-expense-dialog";

export default function ExpenseCard({expense, onDeleted, onUpdated}) {
  return (
    <Card>
      <CardContent className="flex justify-between items-start gap-6 py-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{expense.title}</p>

          <p className="text-sm text-muted-foreground">{expense.date}</p>

          {expense.note && (
            <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap mt-1">
              {expense.note}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-lg font-semibold whitespace-nowrap">
            ₹{expense.amount}
          </p>

          <div className="flex gap-2">
            <EditExpenseDialog expense={expense} onUpdated={onUpdated} />

            <DeleteExpenseDialog expenseId={expense.id} onDeleted={onDeleted} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
