"use client";

import GameCanvas from "@/components/GameCanvas";
import BuildBar from "@/components/BuildBar";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const selectedTile = useGameStore((s) => s.selectedTile);
  const selectedArea = useGameStore((s) => s.selectedArea);

  return (
    <>
      <GameCanvas />

      {(selectedTile || selectedArea) && <BuildBar />}
    </>
  );
}
