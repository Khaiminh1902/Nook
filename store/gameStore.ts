import { create } from "zustand";

export interface TilePosition {
  x: number;
  y: number;
}

export type BuildingType = "house";

export interface BuildingPlacement {
  x: number;
  y: number;
  type: BuildingType;
}

interface GameStore {
  selectedTile: TilePosition | null;
  buildings: BuildingPlacement[];

  setSelectedTile: (tile: TilePosition | null) => void;
  placeBuilding: (building: BuildingPlacement) => void;
}

export const useGameStore = create<GameStore>((set) => ({
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
          (existing) => existing.x !== building.x || existing.y !== building.y,
        ),
        building,
      ],
      selectedTile: null,
    })),
}));
