"use client";

import {useRouter} from "next/navigation";
import {StaggerButton} from "@/components/ui/stagger-button";
import SpotlightCards from "@/components/kokonutui/spotlight-cards";
import {ActivityIcon} from "@/components/ui/activity";
import {BotMessageSquareIcon} from "@/components/ui/bot-message-square";
import {SquarePenIcon} from "@/components/ui/square-pen";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: BotMessageSquareIcon,
      title: "AI Chat",
      description: "Add and manage expenses using natural language.",
      color: "#a78bfa",
    },
    {
      icon: ActivityIcon,
      title: "Smart Tracking",
      description: "Filter and organize expenses effortlessly.",
      color: "#38bdf8",
    },
    {
      icon: SquarePenIcon,
      title: "Subscriptions",
      description: "Manage your recurring expenses easily.",
      color: "#34d399",
    },
    // {
    //   title: "Analytics",
    //   description: "Understand where your money goes.",
    //   color: "#f59e0b",
    // },
  ];

  return (
    <div className="flex flex-col text-white">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          AI-Powered Expense Tracking
        </h1>

        <p className="mt-6 text-muted-foreground max-w-xl text-lg">
          A smarter way to track expenses — with AI assistance, clean insights,
          and zero clutter.
        </p>

        <div className="flex gap-4 mt-8">
          <StaggerButton
            className="bg-white/10 border border-white/30 backdrop-blue-xl text-white"
            onClick={() => router.push("/register")}
          >
            Get Started
          </StaggerButton>

          <StaggerButton
            className="bg-white/10 border border-white/30 backdrop-blue-xl text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </StaggerButton>
        </div>
      </section>

      {/* FEATURES (FIXED) */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <SpotlightCards
          eyebrow="Features"
          heading="Everything you need"
          items={features}
        />
      </section>

      {/* PREVIEW */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Swiggy</span>
              <span>₹250</span>
            </div>

            <div className="flex justify-between">
              <span>Netflix Subscription</span>
              <span>₹649</span>
            </div>

            <div className="flex justify-between">
              <span>Uber</span>
              <span>₹180</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI DEMO */}
      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Talk to your expenses
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Spent 250 on food
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-xl border border-white/10">
              ✅ Expense added
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Show my food expenses
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-xl border border-white/10">
              🍔 ₹250 — Food (Today)
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-24 px-6">
        <h2 className="text-3xl font-semibold">Start tracking smarter today</h2>

        <p className="text-muted-foreground mt-4">
          No setup. No complexity. Just results.
        </p>

        <StaggerButton
          className="bg-white/10 border border-white/30 backdrop-blue-xl text-white mt-6"
          onClick={() => router.push("/register")}
        >
          Create Account
        </StaggerButton>
      </section>
    </div>
  );
}
