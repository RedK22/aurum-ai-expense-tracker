"use client";

import {useState} from "react";
import {apiRequest} from "@/lib/api";

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

export default function CreateCategoryDialog({onCreated}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const created = await apiRequest("/categories/", {
        method: "POST",
        body: JSON.stringify({
          name,
          scope: "PRIVATE",
        }),
      });

      onCreated(created);
      setOpen(false);
      setName("");
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
