"use client";

import {useEffect, useState} from "react";

import {toast} from "@/components/optics/sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import {Button} from "@/components/optics/button";
import {Input} from "@/components/optics/input";
import {Label} from "@/components/optics/label";
import {apiRequest, getCategories} from "@/lib/api";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {StaggerButton} from "../ui/stagger-button";

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
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []);

  // Reset dropdowns on dialog open
  useEffect(() => {
    if (open) {
      setCategory("");
      setFrequency("");
    }
  }, [open]);

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
        <StaggerButton className="bg-white/10 border border-white/30 backdrop-blue-xl text-white">
          Create Subscription
        </StaggerButton>
      </DialogTrigger>

      <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Create Subscription</DialogTitle>
        </DialogHeader>

        <DialogDescription id="subscription-dialog-desc">
          Fill in the details to create a new recurring subscription.
        </DialogDescription>
        <div className="rounded-md bg-yellow-100/80 border border-yellow-400 text-yellow-900 px-4 py-2 text-sm mb-2">
          <strong>Warning:</strong> Creating a subscription will automatically
          create expenses for you. Please ensure your details are correct before
          proceeding.
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form
          onSubmit={handleCreate}
          className="space-y-5"
          aria-describedby="subscription-dialog-desc"
        >
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

            <Select value={category} onValueChange={setCategory}>
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

            <Select value={frequency} onValueChange={setFrequency}>
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

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
