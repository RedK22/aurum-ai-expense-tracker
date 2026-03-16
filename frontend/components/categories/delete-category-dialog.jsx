"use client";

import {useState, useEffect} from "react";

import {apiRequest} from "@/lib/api";
import {toast} from "@/components/optics/sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import {Button} from "@/components/ui/button";

export default function DeleteCategoryDialog({category, onDeleted, disabled}) {
  const [open, setOpen] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset errors whenever modal opens
  useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      await apiRequest(`/categories/${category.id}/`, {
        method: "DELETE",
      });

      toast({
        type: "success",
        title: "Category deleted",
        description: `Category '${category.name}' deleted successfully.`,
      });

      if (onDeleted) {
        onDeleted(category.id);
      }

      setOpen(false);
    } catch (err) {
      setError(err.message || "Failed to delete category");
      toast({
        type: "error",
        title: "Category deletion failed",
        description: err.message || "Could not delete category.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={disabled}>
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete category "{category.name}"?
          </AlertDialogTitle>
        </AlertDialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
