"use client";

import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {useEffect, useState} from "react";

import {logout} from "@/lib/api";
import {useTheme} from "@/components/theme-context";
import {themes} from "@/lib/themes";

import {Button} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {theme, changeTheme} = useTheme();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, [pathname]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <div
          className="font-semibold text-lg cursor-pointer tracking-tight hover:opacity-80 transition"
          onClick={() => router.push("/dashboard")}
        >
          Expense AI
        </div>

        {/* Center Navigation */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/expenses" className="hover:text-white transition">
              Expenses
            </Link>
            <Link href="/subscriptions" className="hover:text-white transition">
              Subscriptions
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Theme
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {Object.entries(themes).map(([key, t]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`flex items-center justify-between ${
                    theme === key ? "text-white font-medium" : ""
                  }`}
                >
                  {t.label}

                  {/* Active indicator */}
                  {theme === key && (
                    <span className="ml-2 text-xs opacity-70">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>

              <Button size="sm" onClick={() => router.push("/register")}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
