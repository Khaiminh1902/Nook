"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import Image from "next/image";
import Cabin from "@/public/assets/buildings/cabin.png";
import DirtRoad from "@/public/assets/road/dirt.png";
import ConcreteRoad from "@/public/assets/road/concrete.png";
import { FaHouse } from "react-icons/fa6";
import { FaRoad, FaTrash } from "react-icons/fa";

export default function BuildBar() {
  const selectedTile = useGameStore((state) => state.selectedTile);
  const buildings = useGameStore((state) => state.buildings);
  const placeBuilding = useGameStore((state) => state.placeBuilding);
  const removeBuilding = useGameStore((state) => state.removeBuilding);
  const [menu, setMenu] = useState<"root" | "buildings" | "roads">("root");

  if (!selectedTile) return null;

  const hasStructure = buildings.some(
    (building) =>
      building.x === selectedTile.x && building.y === selectedTile.y,
  );

  const placePath = (roadSurface: "dirt" | "concrete") => {
    placeBuilding({
      x: selectedTile.x,
      y: selectedTile.y,
      type: "path",
      roadSurface,
    });
  };

  return (
    <div
      className="
        fixed
        bottom-5
        left-1/2
        -translate-x-1/2
        z-20
        w-fit
        max-w-[92vw]
        rounded-[20px]
        border
        border-[#5f4332]/45
        bg-[linear-gradient(180deg,rgba(87,63,48,0.96)_0%,rgba(63,43,31,0.96)_100%)]
        px-3
        py-2.5
        shadow-[0_18px_40px_rgba(27,18,12,0.32)]
        backdrop-blur-md
      "
    >
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e7cb9d]">
          {menu === "root"
            ? "Build Bar"
            : menu === "buildings"
              ? "Buildings"
              : "Roads"}
        </p>
        <div className="rounded-full border border-[#876449] bg-[#e8cfab] px-2.5 py-1 text-[11px] font-semibold text-[#694a34] shadow-inner">
          {selectedTile.x}, {selectedTile.y}
        </div>
      </div>

      {menu === "root" ? (
        <div className="flex gap-2">
          <button
            onClick={() => setMenu("buildings")}
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#ffe5b7]/80
              bg-[linear-gradient(180deg,#fff3d2_0%,#dbaa60_100%)]
              text-[#4b3223]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.28)]
            "
            aria-label="Open buildings menu"
          >
            <span className="text-[26px] leading-none transition group-hover:scale-110">
              <FaHouse />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Buildings
            </span>
          </button>

          <button
            onClick={() => setMenu("roads")}
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#ffe5b7]/80
              bg-[linear-gradient(180deg,#fff3d2_0%,#dbaa60_100%)]
              text-[#4b3223]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.28)]
            "
            aria-label="Open roads menu"
          >
            <span className="text-[28px] leading-none transition group-hover:scale-110">
              <FaRoad />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Path
            </span>
          </button>

          <div
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-[#7a614d]
              bg-[rgba(255,244,214,0.08)]
              text-[#b79a7d]
            "
          >
            <span className="text-[20px] leading-none">+</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Soon
            </span>
          </div>

          <button
            disabled={!hasStructure}
            onClick={() => removeBuilding(selectedTile.x, selectedTile.y)}
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#9a5f4c]/55
              bg-[linear-gradient(180deg,#f6d8c9_0%,#bb755d_100%)]
              text-[#5a2418]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.22)]
              disabled:cursor-not-allowed
              disabled:border-[#6d5749]
              disabled:bg-[linear-gradient(180deg,#cfc0ad_0%,#a89682_100%)]
              disabled:text-[#705f50]
              disabled:opacity-65
              disabled:hover:translate-y-0
              disabled:hover:shadow-none
            "
            aria-label="Remove structure"
          >
            <span className="text-[24px] leading-none">
              <FaTrash />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Remove
            </span>
          </button>
        </div>
      ) : menu === "buildings" ? (
        <div className="flex gap-2">
          <button
            onClick={() => setMenu("root")}
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#7a614d]
              bg-[rgba(255,244,214,0.08)]
              text-[#e7cb9d]
              transition-all
              duration-200
              hover:-translate-y-0.5
            "
            aria-label="Back to build menu"
          >
            <span className="text-[24px] leading-none">←</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Back
            </span>
          </button>

          <button
            onClick={() =>
              placeBuilding({
                x: selectedTile.x,
                y: selectedTile.y,
                type: "house",
              })
            }
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#ffe5b7]/80
              bg-[linear-gradient(180deg,#fff3d2_0%,#dbaa60_100%)]
              text-[#4b3223]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.28)]
            "
            aria-label="Build house"
          >
            <span className="text-[28px] leading-none transition group-hover:scale-110">
              <Image src={Cabin} alt="cabin" width={70} height={70} />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Cabin
            </span>
          </button>

          <button
            disabled
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-not-allowed
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#6d5749]
              bg-[linear-gradient(180deg,#cfc0ad_0%,#a89682_100%)]
              text-[#705f50]
              opacity-65
            "
            aria-label="Barn coming soon"
          >
            <span className="text-[28px] leading-none">🏚️</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Barn
            </span>
          </button>

          <button
            disabled
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-not-allowed
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#6d5749]
              bg-[linear-gradient(180deg,#cfc0ad_0%,#a89682_100%)]
              text-[#705f50]
              opacity-65
            "
            aria-label="Workshop coming soon"
          >
            <span className="text-[28px] leading-none">🏭</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Shop
            </span>
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setMenu("root")}
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#7a614d]
              bg-[rgba(255,244,214,0.08)]
              text-[#e7cb9d]
              transition-all
              duration-200
              hover:-translate-y-0.5
            "
            aria-label="Back to build menu"
          >
            <span className="text-[24px] leading-none">←</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Back
            </span>
          </button>

          <button
            onClick={() => placePath("dirt")}
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#ffe5b7]/80
              bg-[linear-gradient(180deg,#fff3d2_0%,#dbaa60_100%)]
              text-[#4b3223]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.28)]
            "
            aria-label="Build dirt road"
          >
            <span className="text-[28px] leading-none transition group-hover:scale-110">
              <Image src={DirtRoad} alt="dirt road" width={70} height={70} />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Dirt
            </span>
          </button>

          <button
            onClick={() => placePath("concrete")}
            className="
              group
              flex
              h-19.5
              w-19.5
              shrink-0
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#ffe5b7]/80
              bg-[linear-gradient(180deg,#fff3d2_0%,#dbaa60_100%)]
              text-[#4b3223]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_8px_18px_rgba(36,23,14,0.28)]
            "
            aria-label="Build concrete road"
          >
            <span className="text-[28px] leading-none transition group-hover:scale-110">
              <Image
                src={ConcreteRoad}
                alt="concrete road"
                width={70}
                height={70}
              />
            </span>
            <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
              Concrete
            </span>
          </button>

          <div
            className="
              flex
              h-19.5
              w-19.5
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-[#7a614d]
              bg-[rgba(255,244,214,0.08)]
              text-[#b79a7d]
            "
          >
            <span className="text-[20px] leading-none">+</span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em]">
              Soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
