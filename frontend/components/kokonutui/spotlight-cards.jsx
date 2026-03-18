"use client";

import { Cloud, Code, Cpu, Globe, Lock, Zap } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ─────────────────────────────────────────────────────────

const TILT_MAX = 6;

const TILT_SPRING = {
  stiffness: 300,
  damping: 28,
};

const GLOW_SPRING = {
  stiffness: 180,
  damping: 22,
};

const DEFAULT_ITEMS = [
  {
    icon: Zap,
    title: "AI Chat",
    description: "Add and manage expenses using natural language.",
    color: "#a78bfa",
  },
  {
    icon: Lock,
    title: "Secure",
    description: "Your data is protected with authentication and isolation.",
    color: "#60a5fa",
  },
  {
    icon: Globe,
    title: "Accessible",
    description: "Use it anywhere — desktop or mobile, anytime.",
    color: "#34d399",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean APIs and fast performance for smooth experience.",
    color: "#a78bfa",
  },
  {
    icon: Cpu,
    title: "Smart Tracking",
    description: "Filter, search, and organize your expenses effortlessly.",
    color: "#38bdf8",
  },
  {
    icon: Cloud,
    title: "Subscriptions",
    description: "Automate recurring expenses with ease.",
    color: "#f472b6",
  },
];

// ─── Card ─────────────────────────────────────────────────────────────

function Card({ item, dimmed, onHoverStart, onHoverEnd }) {
  const Icon = item.icon;
  const cardRef = useRef(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      ref={cardRef}
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.5 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6",
        "border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl",
        "transition-all duration-300 hover:border-white/20"
      )}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
    >
      {/* Base tint */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}14, transparent 65%)`,
        }}
      />

      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}2e, transparent 65%)`,
        }}
      />

      {/* Shimmer */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[280%]" />

      {/* Icon */}
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}30`,
        }}
      >
        <Icon size={18} strokeWidth={2} style={{ color: item.color }} />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-semibold text-sm text-white tracking-tight">
          {item.title}
        </h3>

        <p className="text-xs text-white/60 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}, transparent)`,
        }}
      />
    </motion.div>
  );
}

Card.displayName = "Card";

// ─── Main Component ────────────────────────────────────────────────────

export default function SpotlightCards({
  items = DEFAULT_ITEMS,
  eyebrow = "Features",
  heading = "Everything you need",
  className,
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl px-8 pt-10 pb-12",
        "bg-transparent",
        className
      )}
    >
      {/* Header */}
      <div className="mb-10 flex flex-col gap-2 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-white/50">
          {eyebrow}
        </p>

        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          {heading}
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.title}
            item={item}
            dimmed={hovered && hovered !== item.title}
            onHoverStart={() => setHovered(item.title)}
            onHoverEnd={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  );
}