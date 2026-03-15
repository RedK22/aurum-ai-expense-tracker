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
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>

          <Link href="/expenses">
            <Button variant="ghost">Expenses</Button>
          </Link>

          <Link href="/categories">
            <Button variant="ghost">Categories</Button>
          </Link>

          <Link href="/subscriptions">
            <Button variant="ghost">Subscriptions</Button>
          </Link>

          <Link href="/chat">
            <Button variant="ghost">AI Chat</Button>
          </Link>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Right side */}
        <div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
