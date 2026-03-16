"use client";

import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/optics/button";
import ExpenseForm from "./expense-form";
import {StaggerButton} from "../ui/stagger-button";

export default function CreateExpenseDialog({onCreated}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <StaggerButton>Create Expense</StaggerButton>
      </DialogTrigger>
      <DialogContent className="bg-transparent backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          hideHeader={true}
          buttonLabel="Add"
          onCreated={() => {
            setOpen(false);
            if (onCreated) onCreated();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
