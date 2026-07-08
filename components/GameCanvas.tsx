"use client";

import { useEffect, useRef } from "react";
import Game from "@/engine/Game";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Game(containerRef.current);

    game.init();

    return () => game.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
