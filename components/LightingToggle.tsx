"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import type { LightingMode } from "@/store/gameStore";

const lightingOptions: Array<{
  value: LightingMode;
  label: string;
}> = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "auto", label: "Auto" },
];

export default function LightingToggle() {
  const lightingMode = useGameStore((state) => state.lightingMode);
  const setLightingMode = useGameStore((state) => state.setLightingMode);
  const [, setClockMinute] = useState(() => new Date().getMinutes());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setClockMinute(new Date().getMinutes());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-3 top-3 z-20 border-[#8A6A4A] border-2 bg-[#5C4331]/95 p-2 shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md">
      <div className="flex gap-2">
        {lightingOptions.map((option) => {
          const selected = option.value === lightingMode;

          return (
            <button
              key={option.value}
              onClick={() => setLightingMode(option.value)}
              className={`min-w-18 border-2 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer ${
                selected
                  ? "border-[#E8D0AB] bg-[#F2DFC2] text-[#4A3323]"
                  : "border-[#8A6A4A] bg-[#6B503C] text-[#F2DFC2] hover:bg-[#7A5D46]"
              }`}
              aria-pressed={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
