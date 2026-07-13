"use client";

import GameCanvas from "@/components/GameCanvas";
import BuildBar from "@/components/BuildBar";
import LightingToggle from "@/components/LightingToggle";
import { useGameStore } from "@/store/gameStore";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function Home() {
  const selectedTile = useGameStore((s) => s.selectedTile);
  const selectedArea = useGameStore((s) => s.selectedArea);

  return (
    <>
      <div className="absolute p-3 pl-4">
        <Link
          href="/"
          className="text-[#4A3323] hover:text-[#5d412c] text-xl font-extrabold flex items-center gap-1"
        >
          <FaArrowLeft className="w-4 h-6" />
          Back
        </Link>
      </div>
      <LightingToggle />
      <GameCanvas />

      {(selectedTile || selectedArea) && <BuildBar />}
    </>
  );
}
