"use client";

import {useEffect, useState} from "react";

import {apiRequest, getCategories} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Button} from "@/components/optics/button";
import {Input} from "@/components/optics/input";
import {Label} from "@/components/optics/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditExpenseDialog({expense, onUpdated}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [note, setNote] = useState(expense.note || "");
  const [date, setDate] = useState(expense.date || "");
  const [category, setCategory] = useState(String(expense.category));

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []);

  // Reset form values whenever dialog opens
  useEffect(() => {
    if (open) {
      setTitle(expense.title);
      setAmount(expense.amount);
      setNote(expense.note || "");
      setDate(expense.date || "");
      setCategory(expense.category ? String(expense.category) : "");
      setError(null);
    }
  }, [open, expense]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        amount: parseFloat(amount),
        category: parseInt(category),
        note: note || "",
      };

      if (date) payload.date = date;

      const updated = await apiRequest(`/expenses/${expense.id}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      toast({
        type: "success",
        title: "Expense updated",
        description: `Expense '${title}' updated successfully.`,
      });

      if (onUpdated) {
        onUpdated(updated);
      }

      setOpen(false);
    } catch (err) {
      setError(err.message || "Failed to update expense");
      toast({
        type: "error",
        title: "Expense update failed",
        description: err.message || "Could not update expense.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-transparent backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
