"use client";
import React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    router.push("/login");
  }

  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/expenses">Expenses</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
