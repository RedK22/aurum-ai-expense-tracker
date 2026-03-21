"use client";

import {useRouter} from "next/navigation";
import {StaggerButton} from "@/components/ui/stagger-button";
import SpotlightCards from "@/components/kokonutui/spotlight-cards";
import {ActivityIcon} from "@/components/ui/activity";
import {BotMessageSquareIcon} from "@/components/ui/bot-message-square";
import {SquarePenIcon} from "@/components/ui/square-pen";

import {Skiper16} from "@/components/ui/skiper-ui/skiper16";
import ss1 from "@/public/images/landing/ss1.png";
import ss2 from "@/public/images/landing/ss2.png";
import ss3 from "@/public/images/landing/ss3.png";
import ss4 from "@/public/images/landing/ss4.png";

export default function Home() {
  const router = useRouter();
  const skiperImages = [ss1, ss2, ss3, ss4];

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

      {/* FEATURES */}
      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <SpotlightCards
          eyebrow="Features"
          heading="Everything you need"
          items={features}
        />
      </section>

      {/* APP SHOWCASE */}
      <section className="px-6 pb-16 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2">
            Experience the App in Motion
          </h2>
          <p className="text-lg text-muted-foreground">
            Scroll down to explore real app screens in a smooth, interactive
            stack.
          </p>
        </div>
        <Skiper16 images={skiperImages} />
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
