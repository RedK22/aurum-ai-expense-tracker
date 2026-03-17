"use client";

import {useState} from "react";

import {apiRequest} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {Button} from "@/components/optics/button";

export default function DeleteExpenseDialog({expenseId, onDeleted}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await apiRequest(`/expenses/${expenseId}/`, {
        method: "DELETE",
      });

      toast({
        type: "success",
        title: "Expense deleted",
        description: `Expense deleted successfully.`,
      });

      if (onDeleted) {
        onDeleted(expenseId);
      }

      setOpen(false);
    } catch (err) {
      setError(err.message || "Failed to delete expense");
      toast({
        type: "error",
        title: "Expense deletion failed",
        description: err.message || "Could not delete expense.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
