"use client";

import {useRouter} from "next/navigation";
import Link from "next/link";
import {logout} from "@/lib/api";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Left navigation */}
        {/* Branding or logo can go here if needed */}
      </div>
    </div>
  );
}
