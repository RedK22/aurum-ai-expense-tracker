"use client";

import { useRouter } from "next/navigation";
import { StaggerButton } from "@/components/ui/stagger-button";
import SpotlightCards from "@/components/kokonutui/spotlight-cards";
import { ActivityIcon } from "@/components/ui/activity";
import { BotMessageSquareIcon } from "@/components/ui/bot-message-square";
import { SquarePenIcon } from "@/components/ui/square-pen";
import { Skiper16 } from "@/components/ui/skiper-ui/skiper16";
import ss1 from "@/public/images/landing/ss1.png";
import ss2 from "@/public/images/landing/ss2.png";
import ss3 from "@/public/images/landing/ss3.png";
import ss4 from "@/public/images/landing/ss4.png";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const skiperImages = [ss1, ss2, ss3, ss4];
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance mobile carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % skiperImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slideLabels = [
    "AI-powered chat",
    "Smart dashboard",
    "Expense tracking",
    "Subscription manager",
  ];

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
  ];

  return (
    <div className="flex flex-col text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center pt-28 pb-32 px-6 overflow-hidden">

        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] rounded-full bg-sky-500/15 blur-[100px]" />
          <div className="absolute bottom-10 right-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
        </div>

        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in beta — free to use
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.1] bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent">
          Aurum
        </h1>

        <p className="mt-2 text-lg md:text-xl font-medium text-white/40 tracking-widest uppercase">
          Intelligent Expense Tracking
        </p>

        <p className="mt-6 text-white/60 max-w-md text-base md:text-lg leading-relaxed">
          Just type what you spent. Aurum understands, organises, and gives you
          clarity — without the spreadsheets.
        </p>

        {/* Glassmorphism stat pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { label: "AI-Powered", color: "text-violet-300" },
            { label: "Zero Setup", color: "text-sky-300" },
            { label: "Real-time Insights", color: "text-emerald-300" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 text-sm font-medium ${color}`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-10">
          <StaggerButton
            className="bg-white/10 border border-white/30 backdrop-blur-xl text-white"
            onClick={() => router.push("/register")}
          >
            Get Started
          </StaggerButton>
          <StaggerButton
            className="bg-white/10 border border-white/30 backdrop-blur-xl text-white"
            onClick={() => router.push("/login")}
          >
            Login
          </StaggerButton>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-1 text-white/20 text-xs">
          <span>scroll to explore</span>
          <div className="h-5 w-px bg-white/10 rounded-full" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <SpotlightCards
          eyebrow="Features"
          heading="Everything you need"
          items={features}
          className="[&_.grid]:grid-cols-1 sm:[&_.grid]:grid-cols-2 md:[&_.grid]:grid-cols-3"
        />
      </section>

      {/* ── APP SHOWCASE ── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Experience the App in Motion
          </h2>
          <p className="text-base text-white/50 max-w-sm mx-auto">
            Scroll to explore real app screens in a smooth, interactive stack.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <Skiper16 images={skiperImages} />
        </div>

        {/* Mobile: auto-advancing carousel with label + dots */}
        <div className="block md:hidden w-full">
          {/* Slide */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {skiperImages.map((img, i) => (
                <div key={i} className="min-w-full flex-shrink-0">
                  <img
                    src={img.src || img}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-64 object-contain bg-black/40"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Slide label */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-3 py-1 text-xs text-white/60">
              {slideLabels[activeSlide]}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {skiperImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative text-center pb-28 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-violet-700/20 blur-[100px]" />
        </div>

        <div className="inline-block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-10 py-12 max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold leading-snug">
            Start tracking smarter today
          </h2>
          <p className="text-white/50 mt-3 text-sm">
            No setup. No complexity. Just results.
          </p>
          <StaggerButton
            className="bg-white/10 border border-white/30 backdrop-blur-xl text-white mt-6"
            onClick={() => router.push("/register")}
          >
            Create Account
          </StaggerButton>
        </div>
      </section>

    </div>
  );
}