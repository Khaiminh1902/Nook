"use client";

import GameCanvas from "@/components/GameCanvas";
import BuildBar from "@/components/BuildBar";
import LightingToggle from "@/components/LightingToggle";
import MusicToggle from "@/components/MusicToggle";
import { useGameStore } from "@/store/gameStore";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function Home() {
  const selectedTile = useGameStore((s) => s.selectedTile);
  const selectedArea = useGameStore((s) => s.selectedArea);

  return (
    <>
      <div className="absolute left-3 top-3 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 border-2 border-[#8A6A4A] bg-[#6B503C] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F2DFC2] shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md transition hover:bg-[#7A5D46]"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>
      <LightingToggle />
      <MusicToggle />
      <GameCanvas />

      {(selectedTile || selectedArea) && <BuildBar />}
    </>
  );
}
