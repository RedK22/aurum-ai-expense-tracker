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

import {useCurrency} from "@/components/currency-context";

// ✅ Icons
import {IndianRupeeIcon} from "./ui/indian-rupee";
import {DollarSignIcon} from "./ui/dollar-sign";
import {PoundSterlingIcon} from "./ui/pound-sterling";
import {EuroIcon} from "./ui/euro";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {theme, changeTheme} = useTheme();

  const {currency, setCurrency} = useCurrency();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, [pathname]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function navigate(path) {
    setOpen(false);
    router.push(path);
  }

  function handleCurrencyChange(cur) {
    setCurrency(cur);
  }

  const currencies = [
    {code: "INR", symbol: "₹", icon: IndianRupeeIcon},
    {code: "USD", symbol: "$", icon: DollarSignIcon},
    {code: "EUR", symbol: "€", icon: EuroIcon},
    {code: "GBP", symbol: "£", icon: PoundSterlingIcon},
    {code: "PLN", symbol: "zł"},
  ];

  const currentCurrency = currencies.find((c) => c.code === currency.code);

  const CurrentIcon = currentCurrency?.icon;

  return (
    <>
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <div
            className="font-semibold text-lg cursor-pointer tracking-tight hover:opacity-80 transition"
            onClick={() => navigate("/dashboard")}
          >
            Expense AI
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/expenses" className="hover:text-white transition">
                Expenses
              </Link>
              <Link
                href="/subscriptions"
                className="hover:text-white transition"
              >
                Subscriptions
              </Link>
              <Link href="/categories" className="hover:text-white transition">
                Categories
              </Link>
              <Link href="/chat" className="hover:text-white transition">
                AI Chat
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* ✅ Currency Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <div className="flex items-center gap-2">
                    {CurrentIcon && <CurrentIcon className="w-4 h-4" />}
                    {currency.symbol} {currency.code}
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {currencies.map((cur) => {
                  const Icon = cur.icon;

                  return (
                    <DropdownMenuItem
                      key={cur.code}
                      onClick={() => handleCurrencyChange(cur)}
                      className={`flex items-center justify-between gap-2 group ${
                        currency.code === cur.code
                          ? "text-white font-medium"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                        )}
                        {cur.symbol} {cur.code}
                      </div>

                      {currency.code === cur.code && (
                        <span className="ml-2 text-xs opacity-70">✓</span>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    {theme === key && (
                      <span className="ml-2 text-xs opacity-70">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop Logout */}
            {isLoggedIn && (
              <div className="hidden md:block">
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            {isLoggedIn && (
              <button
                onClick={() => setOpen(true)}
                className="md:hidden text-xl px-2"
              >
                ☰
              </button>
            )}

            {/* Auth (when logged out) */}
            {!isLoggedIn && (
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

      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300
        bg-white/5 backdrop-blur-xl border-r border-white/10
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 space-y-6">
          <div className="text-lg font-semibold">Menu</div>

          <div className="flex flex-col gap-4 text-sm">
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/expenses")}>Expenses</button>
            <button onClick={() => navigate("/subscriptions")}>
              Subscriptions
            </button>
            <button onClick={() => navigate("/categories")}>Categories</button>
            <button onClick={() => navigate("/chat")}>AI Chat</button>
          </div>

          {/* Logout inside drawer */}
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
