"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import ReactLenis from "lenis/react";
import React, {useRef} from "react";
import Image from "next/image";

const StickyCard_001 = ({i, title, src, progress, range, targetScale}) => {
  const container = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 180}px)`, // less vertical offset for a more compact stack
        }}
        className="rounded-3xl relative -top-1/4 flex h-[480px] w-[900px] origin-top flex-col overflow-hidden shadow-2xl"
      >
        <Image
          src={src}
          alt={title}
          className="h-full w-full object-cover"
          fill={false}
          width={900}
          height={480}
          priority={i === 0}
        />
      </motion.div>
    </div>
  );
};

const Skiper16 = ({images = []}) => {
  const container = useRef(null);
  const {scrollYProgress} = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const projects = images.map((img, idx) => ({
    title: `Screenshot ${idx + 1}`,
    src: img.src ? img.src : img,
  }));

  return (
    <ReactLenis root>
      <main
        ref={container}
        className="relative flex w-full flex-col items-center justify-center pb-[60vh] pt-[30vh]"
      >
        {projects.map((project, i) => {
          const targetScale = Math.max(
            0.6,
            1 - (projects.length - i - 1) * 0.1,
          );
          return (
            <StickyCard_001
              key={`p_${i}`}
              i={i}
              {...project}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export {Skiper16, StickyCard_001};
