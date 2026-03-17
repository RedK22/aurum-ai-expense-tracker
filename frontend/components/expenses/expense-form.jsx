"use client";

import {useEffect, useState} from "react";
import {apiRequest, getCategories} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/optics/card";

import {Input} from "@/components/optics/input";
import {Button} from "@/components/optics/button";
import {Label} from "@/components/optics/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {StaggerButton} from "../ui/stagger-button";

export default function ExpenseForm({
  onCreated,
  hideHeader = false,
  buttonLabel = "Add Expense",
  modal = false,
  triggerLabel = "+ Expense",
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []);

  async function handleSubmit(e) {
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

      if (date) {
        payload.date = date;
      }

      const newExpense = await apiRequest("/expenses/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast({
        type: "success",
        title: "Expense added",
        description: `Expense '${title}' created successfully.`,
      });

      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setNote("");

      if (modal) {
        setOpen(false);
      }
      if (onCreated) {
        onCreated(newExpense);
      }
    } catch (err) {
      setError(err.message || "Failed to create expense");

      toast({
        type: "error",
        title: "Expense creation failed",
        description: err.message || "Could not create expense.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (modal) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <StaggerButton>{triggerLabel}</StaggerButton>
        </DialogTrigger>
        <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val)}
              >
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
              <Label>Date (optional)</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <StaggerButton type="submit" disabled={loading} className="w-full">
              {loading ? "Adding..." : buttonLabel}
            </StaggerButton>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  // Default: render as card (non-modal)
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-md">
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val)}>
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
            <Label>Date (optional)</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <StaggerButton type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : buttonLabel}
          </StaggerButton>
        </form>
      </CardContent>
    </Card>
  );
}
