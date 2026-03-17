"use client";

import {useTheme} from "./theme-context";
import {themes} from "@/lib/themes";
export default function BackgroundLayer() {
  const {theme} = useTheme();

  const current = themes[theme] || themes.emeraldStack;

  return (
    <>
      {/* Base */}
      <div className={`fixed inset-0 -z-10 ${current.base}`} />

      {/* Gradient */}
      <div className="fixed inset-0 -z-10" style={current.style} />

      {/* Optional overlay */}
      {current.overlay && (
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={current.overlay}
        />
      )}
    </>
  );
}
