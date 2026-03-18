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
        <StaggerButton className="bg-white/10 border border-white/30 backdrop-blue-xl text-white">
          Create Expense
        </StaggerButton>
      </DialogTrigger>
      <DialogContent className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
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
