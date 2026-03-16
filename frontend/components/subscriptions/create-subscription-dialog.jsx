"use client";

import {useEffect, useState} from "react";

import {toast} from "@/components/optics/sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateSubscriptionDialog({onCreated}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const data = await apiRequest("/categories/");
    const list = Array.isArray(data) ? data : data.results || [];
    setCategories(list);
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const created = await apiRequest("/recurring/", {
        method: "POST",
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category: parseInt(category),
          frequency,
          start_date: startDate,
        }),
      });

      toast({
        type: "success",
        title: "Subscription created",
        description: `Subscription '${title}' created successfully.`,
      });

      onCreated(created);
      setOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create subscription");
      toast({
        type: "error",
        title: "Subscription creation failed",
        description: err.message || "Could not create subscription.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Subscription</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Subscription</DialogTitle>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frequency</Label>

            <Select onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
