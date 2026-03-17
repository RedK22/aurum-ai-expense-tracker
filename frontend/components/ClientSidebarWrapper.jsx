"use client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/optics/sidebar";
import Link from "next/link";
import {useEffect, useState} from "react";
import {logout} from "@/lib/api";

export default function ClientSidebarWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access"));
  }, []);
  if (!isLoggedIn) return null;
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="!bg-transparent !border-none !shadow-none"
      >
        {/* Collapsible trigger button (top left) */}
        <div className="p-2">
          <div className="md:block hidden ">
            {/* SidebarTrigger is exported from optics/sidebar.jsx */}
            <SidebarTrigger />
          </div>
        </div>
        <SidebarContent className="backdrop-blur-lg bg-white/20 dark:bg-black/30 border border-white/30 dark:border-black/40 shadow-xl rounded-xl m-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref legacyBehavior>
                <SidebarMenuButton as="a">Dashboard</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/expenses" passHref legacyBehavior>
                <SidebarMenuButton as="a">Expenses</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/categories" passHref legacyBehavior>
                <SidebarMenuButton as="a">Categories</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/subscriptions" passHref legacyBehavior>
                <SidebarMenuButton as="a">Subscriptions</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/chat" passHref legacyBehavior>
                <SidebarMenuButton as="a">AI Chat</SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenuItem>
              <SidebarMenuButton
                as="button"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                variant="outline"
              >
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
