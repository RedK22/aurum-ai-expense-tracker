import AuthGuard from "@/components/AuthGuard";
import React from "react";

const Expenses = () => {
  return (
    <>
      <AuthGuard>
        <div>Expenses</div>;
      </AuthGuard>
    </>
  );
};

export default Expenses;
