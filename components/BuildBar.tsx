"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";

import { buildMenuMap, buildMenus } from "@/components/build-bar/menus";
import type { BuildMenu, BuildMenuItem } from "@/components/build-bar/types";
import { useGameStore } from "@/store/gameStore";

type PlaceableMenuItem = Extract<
  BuildMenuItem,
  { kind: "placeBuilding" | "placePath" | "placeGreenery" }
>;

export default function BuildBar() {
  const selectedTile = useGameStore((state) => state.selectedTile);
  const selectedArea = useGameStore((state) => state.selectedArea);
  const buildings = useGameStore((state) => state.buildings);
  const greenery = useGameStore((state) => state.greenery);
  const placeBuilding = useGameStore((state) => state.placeBuilding);
  const placeGreenery = useGameStore((state) => state.placeGreenery);
  const rotateBuilding = useGameStore((state) => state.rotateBuilding);
  const rotateArea = useGameStore((state) => state.rotateArea);
  const removeBuilding = useGameStore((state) => state.removeBuilding);
  const removeGreenery = useGameStore((state) => state.removeGreenery);
  const fillAreaWithBuilding = useGameStore(
    (state) => state.fillAreaWithBuilding,
  );
  const fillAreaWithGreenery = useGameStore(
    (state) => state.fillAreaWithGreenery,
  );
  const removeArea = useGameStore((state) => state.removeArea);
  const setSelectedTile = useGameStore((state) => state.setSelectedTile);
  const setSelectedArea = useGameStore((state) => state.setSelectedArea);
  const [menu, setMenu] = useState<BuildMenu | "root">("root");

  const displayedMenu = menu;

  if (!selectedTile && !selectedArea) return null;

  const anchorTile = selectedTile ?? selectedArea?.start;

  if (!anchorTile) return null;

  const hasBuilding = buildings.some(
    (building) => building.x === anchorTile.x && building.y === anchorTile.y,
  );
  const hasGreenery = greenery.some(
    (item) => item.x === anchorTile.x && item.y === anchorTile.y,
  );
  const hasAreaBuilding = selectedArea
    ? buildings.some(
        (building) =>
          building.x >= Math.min(selectedArea.start.x, selectedArea.end.x) &&
          building.x <= Math.max(selectedArea.start.x, selectedArea.end.x) &&
          building.y >= Math.min(selectedArea.start.y, selectedArea.end.y) &&
          building.y <= Math.max(selectedArea.start.y, selectedArea.end.y),
      )
    : false;
  const hasAreaGreenery = selectedArea
    ? greenery.some(
        (item) =>
          item.x >= Math.min(selectedArea.start.x, selectedArea.end.x) &&
          item.x <= Math.max(selectedArea.start.x, selectedArea.end.x) &&
          item.y >= Math.min(selectedArea.start.y, selectedArea.end.y) &&
          item.y <= Math.max(selectedArea.start.y, selectedArea.end.y),
      )
    : false;
  const hasPlacement = hasBuilding || hasGreenery;

  const primaryButtonClass =
    "group flex h-19.5 w-19.5 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#8A6A4A] bg-[#F2DFC2] text-[#4A3323] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E8D0AB] hover:shadow-[0_8px_18px_rgba(36,23,14,0.20)] active:bg-[#D6B47E]";

  const secondaryButtonClass =
    "flex h-19.5 w-19.5 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#8A6A4A] bg-[#F2DFC2] text-[#4A3323] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E8D0AB] active:bg-[#D6B47E]";

  const disabledButtonClass =
    "flex h-19.5 w-19.5 shrink-0 cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-[#8A6A4A] bg-[#F2DFC2] text-[#8A6A4A] opacity-65";

  const rotateButtonClass =
    "group flex h-19.5 w-19.5 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#8A6A4A] bg-[#B7C8A1] text-[#4A3323] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#A5B78F] hover:shadow-[0_8px_18px_rgba(36,23,14,0.20)] active:bg-[#A5B78F] disabled:cursor-not-allowed disabled:border-[#8A6A4A] disabled:bg-[#B7C8A1] disabled:text-[#8A6A4A] disabled:opacity-65 disabled:hover:translate-y-0 disabled:hover:shadow-none";

  const removeButtonClass =
    "group flex h-19.5 w-19.5 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#8A6A4A] bg-[#D78B7A] text-[#4A3323] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#CB7866] hover:shadow-[0_8px_18px_rgba(36,23,14,0.20)] active:bg-[#CB7866] disabled:cursor-not-allowed disabled:border-[#8A6A4A] disabled:bg-[#D78B7A] disabled:text-[#8A6A4A] disabled:opacity-65 disabled:hover:translate-y-0 disabled:hover:shadow-none";

  const menuTitle =
    displayedMenu === "root" ? "Build Bar" : buildMenuMap[displayedMenu].title;

  const clearSelection = () => {
    setSelectedTile(null);
    setSelectedArea(null);
    setMenu("root");
  };

  const placeMenuItem = (item: PlaceableMenuItem) => {
    if (selectedArea) {
      if (item.kind === "placeGreenery") {
        fillAreaWithGreenery(selectedArea.start, selectedArea.end, (tile) => ({
          ...tile,
          type: item.greeneryType,
        }));
        clearSelection();
        return;
      }

      fillAreaWithBuilding(selectedArea.start, selectedArea.end, (tile) => ({
        ...tile,
        type: item.kind === "placeBuilding" ? item.buildingType : "path",
        roadSurface: item.kind === "placePath" ? item.roadSurface : undefined,
      }));
      clearSelection();
      return;
    }

    if (item.kind === "placeGreenery") {
      placeGreenery({
        x: anchorTile.x,
        y: anchorTile.y,
        type: item.greeneryType,
      });
      clearSelection();
      return;
    }

    if (item.kind === "placeBuilding") {
      placeBuilding({
        x: anchorTile.x,
        y: anchorTile.y,
        type: item.buildingType,
      });
      clearSelection();
      return;
    }

    placeBuilding({
      x: anchorTile.x,
      y: anchorTile.y,
      type: "path",
      roadSurface: item.roadSurface,
    });
    clearSelection();
  };

  const renderBackButton = () => (
    <button
      onClick={() => setMenu("root")}
      className={secondaryButtonClass}
      aria-label="Back to build menu"
    >
      <span className="text-[24px] leading-none">←</span>
      <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
        Back
      </span>
    </button>
  );

  const renderSoonCard = (disabled = false) => (
    <div
      className={
        disabled
          ? disabledButtonClass
          : "flex h-19.5 w-19.5 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-[#8A6A4A] bg-[#F2DFC2] text-[#8A6A4A] opacity-70"
      }
    >
      <span className="text-[20px] leading-none">+</span>
      <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
        Soon
      </span>
    </div>
  );

  const renderRootMenu = () => (
    <div className="flex w-max gap-2">
      {buildMenus.map((buildMenu) => {
        const RootIcon = buildMenu.rootIcon;

        return (
          <button
            key={buildMenu.id}
            onClick={() => setMenu(buildMenu.id)}
            className={primaryButtonClass}
            aria-label={buildMenu.rootAriaLabel}
          >
            <span className="text-[28px] leading-none transition group-hover:scale-110">
              <RootIcon />
            </span>
            <span
              className={`mt-2 text-[9px] font-bold uppercase tracking-[0.16em] ${
                buildMenu.rootLabelClassName ?? ""
              }`.trim()}
            >
              {buildMenu.rootLabel}
            </span>
          </button>
        );
      })}

      {renderSoonCard()}

      <button
        disabled={
          selectedArea ? !(hasAreaBuilding || hasAreaGreenery) : !hasPlacement
        }
        onClick={() => {
          if (selectedArea) {
            rotateArea(selectedArea.start, selectedArea.end);
            return;
          }

          rotateBuilding(anchorTile.x, anchorTile.y);
        }}
        className={rotateButtonClass}
        aria-label={selectedArea ? "Rotate selected area" : "Rotate structure"}
      >
        <span className="text-[22px] leading-none transition group-hover:rotate-45">
          <FaRotate />
        </span>
        <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
          Rotate
        </span>
      </button>

      <button
        onClick={() => {
          if (selectedArea) {
            removeArea(selectedArea.start, selectedArea.end);
            clearSelection();
            return;
          }

          if (hasBuilding) {
            removeBuilding(anchorTile.x, anchorTile.y);
          }

          if (hasGreenery) {
            removeGreenery(anchorTile.x, anchorTile.y);
          }

          clearSelection();
        }}
        disabled={!selectedArea && !hasPlacement}
        className={removeButtonClass}
        aria-label={selectedArea ? "Delete selected area" : "Remove placement"}
      >
        <span className="text-[24px] leading-none">
          <FaTrash />
        </span>
        <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">
          Delete
        </span>
      </button>
    </div>
  );

  const renderMenuItem = (item: BuildMenuItem, index: number) => {
    if (item.kind === "soon") {
      return (
        <div key={`soon-${index}`}>
          {renderSoonCard(displayedMenu === "buildings")}
        </div>
      );
    }

    const placeableItem: PlaceableMenuItem = item;

    return (
      <button
        key={`${item.kind}-${item.label}`}
        onClick={() => placeMenuItem(placeableItem)}
        className={primaryButtonClass}
        aria-label={item.ariaLabel}
      >
        <span
          className={`text-[28px] leading-none transition group-hover:scale-110 ${
            item.imageClassName ?? ""
          }`.trim()}
        >
          <Image
            src={item.imageSrc}
            alt={item.label.toLowerCase()}
            width={item.imageWidth}
            height={item.imageHeight}
          />
        </span>
        <span
          className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
            item.labelClassName ?? "mt-2"
          }`.trim()}
        >
          {item.label}
        </span>
      </button>
    );
  };

  const renderSubmenu = () => {
    if (displayedMenu === "root") return null;

    return (
      <div className="flex w-max gap-2">
        {renderBackButton()}
        {buildMenuMap[displayedMenu].items.map(renderMenuItem)}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-20 w-fit max-w-[92vw] -translate-x-1/2 rounded-[20px] border border-[#8A6A4A] bg-[#5C4331] px-3 py-2.5 shadow-[0_18px_40px_rgba(27,18,12,0.32)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F2DFC2]">
          {menuTitle}
        </p>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-[#8A6A4A] bg-[#F2DFC2] px-2.5 py-1 text-[11px] font-semibold text-[#4A3323] shadow-inner">
            {anchorTile.x}, {anchorTile.y}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden pb-1 pt-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {displayedMenu === "root" ? renderRootMenu() : renderSubmenu()}
      </div>
    </div>
  );
}
