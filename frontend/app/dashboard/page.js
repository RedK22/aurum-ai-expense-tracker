import AuthGuard from "@/components/AuthGuard";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <AuthGuard>
        <div>Dashboard</div>;
      </AuthGuard>
    </>
  );
};

export default Dashboard;
