"use client";

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {StaggerButton} from "@/components/ui/stagger-button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col text-white">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-4xl  md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          AI-Powered Expense Tracking
        </h1>

        <p className="mt-6 text-muted-foreground max-w-xl text-lg">
          A smarter way to track expenses - with AI assistance, clean insights,
          and zero clutter.
        </p>

        <div className="flex gap-4 mt-8">
          <StaggerButton onClick={() => router.push("/register")}>
            Get Started
          </StaggerButton>

          <StaggerButton className="" onClick={() => router.push("/login")}>
            Login
          </StaggerButton>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: "AI Chat",
              desc: "Add and manage expenses using natural language",
            },
            {
              title: "Smart Tracking",
              desc: "Filter and organize expenses effortlessly",
            },
            {
              title: "Subscriptions",
              desc: "Automate recurring expenses seamlessly",
            },
            {
              title: "Analytics",
              desc: "Understand where your money goes",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-white/10 hover:-translate-y-2 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW (simple for now) */}
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

      {/* FINAL CTA */}
      <section className="text-center pb-24 px-6">
        <h2 className="text-3xl font-semibold">Start tracking smarter today</h2>

        <p className="text-muted-foreground mt-4">
          No setup. No complexity. Just results.
        </p>

        <Button className="mt-6" onClick={() => router.push("/register")}>
          Create Account
        </Button>
      </section>
    </div>
  );
}
