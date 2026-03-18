"use client";

import {useState} from "react";

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
import {apiRequest, invalidateCategories} from "@/lib/api";
import {StaggerButton} from "../ui/stagger-button";

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

      toast({
        type: "success",
        title: "Category created",
        description: `Category '${name}' created successfully.`,
      });

      onCreated(created);
      setOpen(false);
      setName("");
      invalidateCategories();
    } catch (err) {
      setError(err.message || "Failed to create category");
      toast({
        type: "error",
        title: "Category creation failed",
        description: err.message || "Could not create category.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <StaggerButton className="bg-white/10 border border-white/30 backdrop-blue-xl text-white">
          Create Category
        </StaggerButton>
      </DialogTrigger>

      <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
