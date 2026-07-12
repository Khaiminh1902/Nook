import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TilePosition {
  x: number;
  y: number;
}

export interface TileAreaSelection {
  start: TilePosition;
  end: TilePosition;
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
  selectedArea: TileAreaSelection | null;
  buildings: BuildingPlacement[];

  setSelectedTile: (tile: TilePosition | null) => void;
  setSelectedArea: (area: TileAreaSelection | null) => void;
  placeBuilding: (building: BuildingPlacement) => void;
  rotateBuilding: (x: number, y: number) => void;
  removeBuilding: (x: number, y: number) => void;
  fillArea: (
    start: TilePosition,
    end: TilePosition,
    buildingFactory: (tile: TilePosition) => BuildingPlacement,
  ) => void;
  removeArea: (start: TilePosition, end: TilePosition) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      selectedTile: null,
      selectedArea: null,
      buildings: [],

      setSelectedTile: (tile) =>
        set({
          selectedTile: tile,
          selectedArea: null,
        }),

      setSelectedArea: (area) =>
        set((state) => ({
          selectedArea: area,
          selectedTile: area ? null : state.selectedTile,
        })),

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
        })),

      fillArea: (start, end, buildingFactory) =>
        set((state) => {
          const minX = Math.min(start.x, end.x);
          const maxX = Math.max(start.x, end.x);
          const minY = Math.min(start.y, end.y);
          const maxY = Math.max(start.y, end.y);
          const nextBuildings = state.buildings.filter(
            (existing) =>
              existing.x < minX ||
              existing.x > maxX ||
              existing.y < minY ||
              existing.y > maxY,
          );

          for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
              nextBuildings.push({
                ...buildingFactory({ x, y }),
                orientation: 0,
              });
            }
          }

          return {
            buildings: nextBuildings,
            selectedArea: null,
          };
        }),

      removeArea: (start, end) =>
        set((state) => {
          const minX = Math.min(start.x, end.x);
          const maxX = Math.max(start.x, end.x);
          const minY = Math.min(start.y, end.y);
          const maxY = Math.max(start.y, end.y);

          return {
            buildings: state.buildings.filter(
              (existing) =>
                existing.x < minX ||
                existing.x > maxX ||
                existing.y < minY ||
                existing.y > maxY,
            ),
            selectedArea: null,
          };
        }),
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
