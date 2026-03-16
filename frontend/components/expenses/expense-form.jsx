"use client";

import {useEffect, useState} from "react";
import {apiRequest} from "@/lib/api";
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

export default function ExpenseForm({onCreated}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const data = await apiRequest("/categories/");

      const categoryList = Array.isArray(data) ? data : data.results || [];

      setCategories(categoryList);
    } catch (err) {
      setError("Failed to load categories");
    }
  }

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

  return (
    <Card className="bg-transparent backdrop-blur-md">
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
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

          {/* Category */}
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

          {/* Date */}
          <div className="space-y-2">
            <Label>Date (optional)</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
