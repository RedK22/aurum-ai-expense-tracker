"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {useRef} from "react";

const cards = [
  {title: "Dashboard", src: "/images/landing/ss1.png"},
  {title: "Expenses", src: "/images/landing/ss2.png"},
  {title: "Analytics", src: "/images/landing/ss3.png"},
  {title: "AI Chat", src: "/images/landing/ss4.png"},
];

export default function CardStack() {
  const container = useRef(null);

  const {scrollYProgress} = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section className="h-[300vh] relative">
      <div
        ref={container}
        className="sticky top-0 h-screen flex items-center justify-center"
      >
        <div className="relative w-[600px] h-[350px]">
          {cards.map((card, i) => {
            const start = i * 0.2;
            const end = start + 0.3;

            const scale = useTransform(
              scrollYProgress,
              [start, end],
              [1, 0.85],
            );

            const y = useTransform(scrollYProgress, [start, end], [0, -40]);

            const opacity = useTransform(
              scrollYProgress,
              [start, end],
              [1, 0.6],
            );

            return (
              <motion.div
                key={i}
                style={{
                  scale,
                  y,
                  opacity,
                  zIndex: cards.length - i,
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-3 left-3 text-xs px-3 py-1 rounded-md bg-black/50 border border-white/10">
                  {card.title}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
