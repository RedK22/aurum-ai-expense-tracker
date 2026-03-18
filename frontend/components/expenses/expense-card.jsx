"use client";

import {Card, CardContent} from "@/components/ui/card";

import EditExpenseDialog from "./edit-expense-dialog";
import DeleteExpenseDialog from "./delete-expense-dialog";
import {formatCurrency} from "@/lib/currency";
import {useCurrency} from "@/components/currency-context";

export default function ExpenseCard({expense, onDeleted, onUpdated}) {
  const {currency} = useCurrency();
  return (
    <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-md hover:shadow-lg hover:border-white/20 transition-all duration-300">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        {/* Left: Title + Meta */}
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold truncate">{expense.title}</p>

          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            <span>{expense.date}</span>
            <span>•</span>
            <span>{expense.category_name}</span>
          </div>

          {expense.note && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {expense.note}
            </p>
          )}
        </div>

        {/* Right: Amount + Actions */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold whitespace-nowrap">
            {formatCurrency(expense.amount, currency)}
          </p>

          <div className="flex gap-2">
            <EditExpenseDialog expense={expense} onUpdated={onUpdated} />
            <DeleteExpenseDialog expenseId={expense.id} onDeleted={onDeleted} />
          </div>
        </div>
      </CardContent>

      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </Card>
  );
}
