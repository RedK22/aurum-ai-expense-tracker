"use client";

import {useEffect, useState} from "react";

import {apiRequest, invalidateCategories} from "@/lib/api";
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

export default function EditCategoryDialog({category, onUpdated, disabled}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(category.name);
      setError(null);
    }
  }, [open, category]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updated = await apiRequest(`/categories/${category.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          scope: category.scope,
        }),
      });

      toast({
        type: "success",
        title: "Category updated",
        description: `Category '${name}' updated successfully.`,
      });

      if (onUpdated) {
        onUpdated(updated);
      }

      setOpen(false);
      invalidateCategories();
    } catch (err) {
      setError(err.message || "Failed to update category");
      toast({
        type: "error",
        title: "Category update failed",
        description: err.message || "Could not update category.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={disabled}>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-transparent backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>

            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
