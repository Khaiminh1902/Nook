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

export type BuildingType = "cabin" | "house" | "tree" | "path";
export type RoadSurface = "dirt" | "concrete" | "water";
export type LightingMode = "day" | "night" | "auto";
export type GreeneryType = "oak" | "ash" | "maple" | "willow" | "streetLamp";
type LegacyGreeneryType = "tree" | "tree2" | "tree3" | "tree4";
type LegacyBuildingType = "streetLamp";

export interface BuildingPlacement {
  x: number;
  y: number;
  type: BuildingType;
  roadSurface?: RoadSurface;
  orientation?: 0 | 1 | 2 | 3;
  mirrored?: boolean;
}

export interface GreeneryPlacement {
  x: number;
  y: number;
  type: GreeneryType | LegacyGreeneryType;
  orientation?: 0 | 1 | 2 | 3;
}

const LEGACY_GREENERY_TYPE_MAP: Record<LegacyGreeneryType, GreeneryType> = {
  tree: "oak",
  tree2: "ash",
  tree3: "maple",
  tree4: "willow",
};

const normalizeGreeneryType = (
  type: GreeneryType | LegacyGreeneryType,
): GreeneryType => {
  if (type in LEGACY_GREENERY_TYPE_MAP) {
    return LEGACY_GREENERY_TYPE_MAP[type as LegacyGreeneryType];
  }

  return type as GreeneryType;
};

const isLegacyStreetLampBuilding = (
  building: BuildingPlacement | (Omit<BuildingPlacement, "type"> & { type: LegacyBuildingType }),
): building is Omit<BuildingPlacement, "type"> & { type: LegacyBuildingType } =>
  building.type === "streetLamp";

interface GameStore {
  selectedTile: TilePosition | null;
  selectedArea: TileAreaSelection | null;
  buildings: BuildingPlacement[];
  greenery: GreeneryPlacement[];
  lightingMode: LightingMode;
  musicEnabled: boolean;
  musicVolume: number;

  setSelectedTile: (tile: TilePosition | null) => void;
  setSelectedArea: (area: TileAreaSelection | null) => void;
  setLightingMode: (mode: LightingMode) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setMusicVolume: (volume: number) => void;
  placeBuilding: (building: BuildingPlacement) => void;
  placeGreenery: (greenery: GreeneryPlacement) => void;
  rotateBuilding: (x: number, y: number) => void;
  rotateArea: (start: TilePosition, end: TilePosition) => void;
  removeBuilding: (x: number, y: number) => void;
  removeGreenery: (x: number, y: number) => void;
  fillAreaWithBuilding: (
    start: TilePosition,
    end: TilePosition,
    buildingFactory: (tile: TilePosition) => BuildingPlacement,
  ) => void;
  fillAreaWithGreenery: (
    start: TilePosition,
    end: TilePosition,
    greeneryFactory: (tile: TilePosition) => GreeneryPlacement,
  ) => void;
  removeArea: (start: TilePosition, end: TilePosition) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      selectedTile: null,
      selectedArea: null,
      buildings: [],
      greenery: [],
      lightingMode: "auto",
      musicEnabled: false,
      musicVolume: 0.1,

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

      setLightingMode: (lightingMode) =>
        set({
          lightingMode,
        }),

      setMusicEnabled: (musicEnabled) =>
        set({
          musicEnabled,
        }),

      setMusicVolume: (musicVolume) =>
        set({
          musicVolume,
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
          greenery:
            building.type === "path" && building.roadSurface !== "concrete"
              ? state.greenery
              : state.greenery.filter(
                  (existing) =>
                    existing.x !== building.x || existing.y !== building.y,
                ),
        })),

      placeGreenery: (greenery) =>
        set((state) => {
          const blocker = state.buildings.find(
            (building) =>
              building.x === greenery.x &&
              building.y === greenery.y &&
              (building.type !== "path" || building.roadSurface === "concrete"),
          );

          if (blocker) {
            return state;
          }

          return {
            greenery: [
              ...state.greenery.filter(
                (existing) =>
                  existing.x !== greenery.x || existing.y !== greenery.y,
              ),
              {
                ...greenery,
                type: normalizeGreeneryType(greenery.type),
                orientation: greenery.orientation ?? 0,
              },
            ],
          };
        }),

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
          greenery: state.greenery.map((existing) =>
            existing.x === x && existing.y === y
              ? {
                  ...existing,
                  orientation:
                    (((existing.orientation ?? 0) + 1) % 4) as 0 | 1 | 2 | 3,
                }
              : existing,
          ),
        })),

      rotateArea: (start, end) =>
        set((state) => {
          const minX = Math.min(start.x, end.x);
          const maxX = Math.max(start.x, end.x);
          const minY = Math.min(start.y, end.y);
          const maxY = Math.max(start.y, end.y);

          return {
            buildings: state.buildings.map((existing) =>
              existing.x >= minX &&
              existing.x <= maxX &&
              existing.y >= minY &&
              existing.y <= maxY
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
            greenery: state.greenery.map((existing) =>
              existing.x >= minX &&
              existing.x <= maxX &&
              existing.y >= minY &&
              existing.y <= maxY
                ? {
                    ...existing,
                    orientation:
                      (((existing.orientation ?? 0) + 1) % 4) as 0 | 1 | 2 | 3,
                  }
                : existing,
            ),
          };
        }),

      removeBuilding: (x, y) =>
        set((state) => ({
          buildings: state.buildings.filter(
            (existing) => existing.x !== x || existing.y !== y,
          ),
        })),

      removeGreenery: (x, y) =>
        set((state) => ({
          greenery: state.greenery.filter(
            (existing) => existing.x !== x || existing.y !== y,
          ),
        })),

      fillAreaWithBuilding: (start, end, buildingFactory) =>
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

          const sampleBuilding = buildingFactory(start);
          const nextGreenery =
            sampleBuilding.type === "path" &&
            sampleBuilding.roadSurface !== "concrete"
              ? state.greenery
              : state.greenery.filter(
                  (existing) =>
                    existing.x < minX ||
                    existing.x > maxX ||
                    existing.y < minY ||
                    existing.y > maxY,
                );

          return {
            buildings: nextBuildings,
            greenery: nextGreenery,
            selectedArea: null,
          };
        }),

      fillAreaWithGreenery: (start, end, greeneryFactory) =>
        set((state) => {
          const minX = Math.min(start.x, end.x);
          const maxX = Math.max(start.x, end.x);
          const minY = Math.min(start.y, end.y);
          const maxY = Math.max(start.y, end.y);
          const nextGreenery = state.greenery.filter(
            (existing) =>
              existing.x < minX ||
              existing.x > maxX ||
              existing.y < minY ||
              existing.y > maxY,
          );

          for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
              const blocker = state.buildings.find(
                (building) =>
                  building.x === x &&
                  building.y === y &&
                  (building.type !== "path" ||
                    building.roadSurface === "concrete"),
              );

              if (blocker) continue;

              const greenery = greeneryFactory({ x, y });

              nextGreenery.push({
                ...greenery,
                type: normalizeGreeneryType(greenery.type),
                orientation: 0,
              });
            }
          }

          return {
            greenery: nextGreenery,
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
            greenery: state.greenery.filter(
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
      version: 3,
      migrate: (persistedState) => {
        if (
          !persistedState ||
          typeof persistedState !== "object"
        ) {
          return persistedState;
        }

        const typedState = persistedState as {
          greenery?: GreeneryPlacement[];
          buildings?: Array<
            BuildingPlacement | (Omit<BuildingPlacement, "type"> & { type: LegacyBuildingType })
          >;
        };

        const greenery = Array.isArray(typedState.greenery)
          ? typedState.greenery.map((item) => ({
              ...item,
              type: normalizeGreeneryType(item.type),
            }))
          : [];

        const buildings = Array.isArray(typedState.buildings)
          ? typedState.buildings
          : [];

        const migratedStreetLamps = buildings
          .filter(isLegacyStreetLampBuilding)
          .map(({ x, y, orientation }) => ({
            x,
            y,
            type: "streetLamp" as const,
            orientation: orientation ?? 0,
          }));

        return {
          ...persistedState,
          greenery: [...greenery, ...migratedStreetLamps].filter(
            (item, index, items) =>
              items.findIndex(
                (candidate) => candidate.x === item.x && candidate.y === item.y,
              ) === index,
          ),
          buildings: buildings.filter(
            (building): building is BuildingPlacement =>
              !isLegacyStreetLampBuilding(building),
          ),
        };
      },
      partialize: (state) => ({
        lightingMode: state.lightingMode,
        musicEnabled: state.musicEnabled,
        musicVolume: state.musicVolume,
        greenery: state.greenery.map((item) => ({
          ...item,
          type: normalizeGreeneryType(item.type),
          orientation: item.orientation ?? 0,
        })),
        buildings: state.buildings.map(({ mirrored, ...building }) => ({
          ...building,
          orientation: building.orientation ?? (mirrored ? 1 : 0),
        })),
      }),
    },
  ),
);
