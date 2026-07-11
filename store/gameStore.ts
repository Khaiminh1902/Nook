import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TilePosition {
  x: number;
  y: number;
}

export type BuildingType = "cabin" | "house" | "path";
export type RoadSurface = "dirt" | "concrete" | "water";

export interface BuildingPlacement {
  x: number;
  y: number;
  type: BuildingType;
  roadSurface?: RoadSurface;
  orientation?: 0 | 1 | 2 | 3;
  mirrored?: boolean;
}

interface GameStore {
  selectedTile: TilePosition | null;
  buildings: BuildingPlacement[];

  setSelectedTile: (tile: TilePosition | null) => void;
  placeBuilding: (building: BuildingPlacement) => void;
  rotateBuilding: (x: number, y: number) => void;
  removeBuilding: (x: number, y: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      selectedTile: null,
      buildings: [],

      setSelectedTile: (tile) =>
        set({
          selectedTile: tile,
        }),

      placeBuilding: (building) =>
        set((state) => ({
          buildings: [
            ...state.buildings.filter(
              (existing) =>
                existing.x !== building.x || existing.y !== building.y,
            ),
            {
              ...building,
              orientation: building.orientation ?? 0,
            },
          ],
          selectedTile: null,
        })),

      rotateBuilding: (x, y) =>
        set((state) => ({
          buildings: state.buildings.map((existing) =>
            existing.x === x && existing.y === y
              ? {
                  ...existing,
                  orientation:
                    (((existing.orientation ??
                      (existing.mirrored ? 1 : 0)) +
                      1) %
                      4) as 0 | 1 | 2 | 3,
                }
              : existing,
          ),
        })),

      removeBuilding: (x, y) =>
        set((state) => ({
          buildings: state.buildings.filter(
            (existing) => existing.x !== x || existing.y !== y,
          ),
          selectedTile: null,
        })),
    }),
    {
      name: "nook-game-store",
      partialize: (state) => ({
        buildings: state.buildings.map(({ mirrored, ...building }) => ({
          ...building,
          orientation: building.orientation ?? (mirrored ? 1 : 0),
        })),
      }),
    },
  ),
);
