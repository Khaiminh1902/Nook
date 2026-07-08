"use client";

import { useGameStore } from "@/store/gameStore";

export default function BuildBar() {
  const selectedTile = useGameStore((state) => state.selectedTile);
  const placeBuilding = useGameStore((state) => state.placeBuilding);

  if (!selectedTile) return null;

  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        bg-white/90
        backdrop-blur
        rounded-2xl
        shadow-xl
        flex
        gap-3
        p-3
      "
    >
      <button
        className="text-3xl hover:scale-110 transition"
        onClick={() =>
          placeBuilding({
            x: selectedTile.x,
            y: selectedTile.y,
            type: "house",
          })
        }
      >
        🏡
      </button>

      <button className="text-3xl opacity-50 cursor-not-allowed">🌳</button>

      <button className="text-3xl opacity-50 cursor-not-allowed">🛣️</button>
    </div>
  );
}
