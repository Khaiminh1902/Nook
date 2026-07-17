import { Assets, Container, Sprite } from "pixi.js";

import { TILE_WIDTH } from "@/engine/constants";
import {
  BuildingPlacement,
  GreeneryPlacement,
  GreeneryType,
} from "@/store/gameStore";
import { isoToWorld } from "@/utils/iso";

const ROAD_TEXTURES = {
  dirt: {
    src: "/assets/game/dirt.png",
    visibleWidth: 251,
    offsetX: 0,
    offsetY: 0,
    overscan: 1,
  },
  concrete: {
    src: "/assets/road/concrete.png",
    visibleWidth: 855,
    offsetX: -10,
    offsetY: 34,
    overscan: 1,
  },
  water: {
    src: "/assets/game/water.png",
    visibleWidth: 255,
    offsetX: 0,
    offsetY: 0,
    overscan: 1,
  },
} as const;

const CABIN_TEXTURE = {
  src: "/assets/buildings/cabin.png",
  visibleWidth: 460,
  footprintCenterX: 127.5 / 256,
  footprintBaseY: 250 / 256,
  offsetX: 0,
  offsetY: 115,
  overscan: 1,
} as const;

const CABIN_BACK_TEXTURE = {
  src: "/assets/buildings/cabin-back.png",
  visibleWidth: 340,
  footprintCenterX: 127.5 / 256,
  footprintBaseY: 250 / 256,
  offsetX: 0,
  offsetY: 161,
  overscan: 1,
} as const;

const HOUSE_TEXTURE = {
  src: "/assets/buildings/house.png",
  visibleWidth: 390,
  footprintCenterX: 275.5 / 550,
  footprintBaseY: 394 / 454,
  offsetX: 0,
  offsetY: 100,
  overscan: 1,
} as const;

const STREET_LAMP_TEXTURE = {
  src: "/assets/light/streelamp.png",
  visibleWidth: 1000,
  footprintCenterX: 0.5,
  footprintBaseY: 0.98,
  offsetX: 0,
  offsetY: 150,
  overscan: 0.95,
} as const;

const FENCE_TEXTURE = {
  src: "/assets/walls/fence.png",
  visibleWidth: 780,
  footprintCenterX: 0.5,
  footprintBaseY: 0.86,
  offsetX: 0,
  offsetY: 170,
  overscan: 1,
} as const;

const FENCE_CORNER_TEXTURE = {
  src: "/assets/walls/fence-corner-bottom.png",
  visibleWidth: 850,
  footprintCenterX: 0.5,
  footprintBaseY: 0.87,
  offsetX: 0,
  offsetY: 120,
  overscan: 1,
} as const;

const FENCE_CORNER_TOP_TEXTURE = {
  src: "/assets/walls/fence-corner-top.png",
  visibleWidth: 690,
  footprintCenterX: 0.5,
  footprintBaseY: 0.87,
  offsetX: 0,
  offsetY: 370,
  overscan: 1,
} as const;

const FENCE_CORNER_LEFT_TEXTURE = {
  src: "/assets/walls/fence-corner-left.png",
  visibleWidth: 900,
  footprintCenterX: 0.5,
  footprintBaseY: 0.87,
  offsetX: 50,
  offsetY: 180,
  overscan: 1,
} as const;

const FENCE_CORNER_RIGHT_TEXTURE = {
  src: "/assets/walls/fence-corner-right.png",
  visibleWidth: 900,
  footprintCenterX: 0.5,
  footprintBaseY: 0.87,
  offsetX: -50,
  offsetY: 180,
  overscan: 1,
} as const;

const JAPAN_GATE_TEXTURE = {
  src: "/assets/artistic/japan-gate.png",
  visibleWidth: 850,
  footprintCenterX: 0.5,
  footprintBaseY: 0.86,
  offsetX: 60,
  offsetY: 140,
  overscan: 1.05,
} as const;

type RenderTexture = {
  src: string;
  visibleWidth: number;
  footprintCenterX: number;
  footprintBaseY: number;
  offsetX: number;
  offsetY: number;
  overscan: number;
};

type FenceRenderStyle = {
  texture: RenderTexture;
  rotation: number;
  mirrored: boolean;
};

const GREENERY_TEXTURES: Record<GreeneryType, RenderTexture> = {
  oak: {
    src: "/assets/greenery/1.png",
    visibleWidth: 1000,
    footprintCenterX: 0.5,
    footprintBaseY: 0.9,
    offsetX: 70,
    offsetY: 50,
    overscan: 1.35,
  },
  ash: {
    src: "/assets/greenery/2.png",
    visibleWidth: 850,
    footprintCenterX: 0.5,
    footprintBaseY: 0.9,
    offsetX: 10,
    offsetY: 130,
    overscan: 1.35,
  },
  maple: {
    src: "/assets/greenery/3.png",
    visibleWidth: 1000,
    footprintCenterX: 0.5,
    footprintBaseY: 0.9,
    offsetX: 10,
    offsetY: 40,
    overscan: 1.35,
  },
  willow: {
    src: "/assets/greenery/4.png",
    visibleWidth: 800,
    footprintCenterX: 0.5,
    footprintBaseY: 0.9,
    offsetX: 30,
    offsetY: 70,
    overscan: 1.35,
  },
  streetLamp: STREET_LAMP_TEXTURE,
  fence: FENCE_TEXTURE,
  gate: JAPAN_GATE_TEXTURE,
} as const;

const isFencePlacement = (placement: BuildingPlacement | GreeneryPlacement) =>
  placement.type === "fence";

const createFenceKey = (x: number, y: number) => `${x},${y}`;

const resolveFenceStyle = (
  fence: GreeneryPlacement,
  fenceKeys: Set<string>,
): FenceRenderStyle => {
  const hasLeft = fenceKeys.has(createFenceKey(fence.x - 1, fence.y));
  const hasRight = fenceKeys.has(createFenceKey(fence.x + 1, fence.y));
  const hasUp = fenceKeys.has(createFenceKey(fence.x, fence.y - 1));
  const hasDown = fenceKeys.has(createFenceKey(fence.x, fence.y + 1));
  const orientation = fence.orientation ?? 0;
  const horizontalNeighbors = Number(hasLeft) + Number(hasRight);
  const verticalNeighbors = Number(hasUp) + Number(hasDown);
  const neighborCount = horizontalNeighbors + verticalNeighbors;
  const isCorner =
    neighborCount === 2 && horizontalNeighbors === 1 && verticalNeighbors === 1;

  const cornerPairs = [
    {
      matches: hasLeft && hasUp,
      texture: FENCE_CORNER_TEXTURE,
      rotation: 0,
    },
    {
      matches: hasUp && hasRight,
      texture: FENCE_CORNER_LEFT_TEXTURE,
      rotation: 0,
    },
    {
      matches: hasRight && hasDown,
      texture: FENCE_CORNER_TOP_TEXTURE,
      rotation: 0,
    },
    {
      matches: hasDown && hasLeft,
      texture: FENCE_CORNER_RIGHT_TEXTURE,
      rotation: 0,
    },
  ];

  const cornerPair = isCorner
    ? cornerPairs.find((pair) => pair.matches)
    : undefined;

  if (cornerPair) {
    return {
      texture: cornerPair.texture,
      rotation: cornerPair.rotation,
      mirrored: false,
    };
  }

  return {
    texture: FENCE_TEXTURE,
    rotation: 0,
    mirrored: orientation % 2 === 1,
  };
};

export default class BuildingRenderer {
  public readonly container = new Container();
  public readonly roadsContainer = new Container();
  public readonly housesContainer = new Container();

  constructor() {
    this.container.addChild(this.roadsContainer);
    this.container.addChild(this.housesContainer);
  }

  sync(buildings: BuildingPlacement[], greenery: GreeneryPlacement[]) {
    this.roadsContainer.removeChildren().forEach((child) => child.destroy());
    this.housesContainer.removeChildren().forEach((child) => child.destroy());

    const placements = [...buildings, ...greenery];
    const fenceKeys = new Set(
      greenery
        .filter(isFencePlacement)
        .map((fence) => createFenceKey(fence.x, fence.y)),
    );

    const sortedBuildings = placements.sort((a, b) => {
      const aPos = isoToWorld(a.x, a.y);
      const bPos = isoToWorld(b.x, b.y);

      if (aPos.y !== bPos.y) return aPos.y - bPos.y;

      return aPos.x - bPos.x;
    });

    for (const building of sortedBuildings) {
      const orientation =
        building.orientation ??
        ("mirrored" in building && building.mirrored ? 1 : 0);
      const isMirrored = orientation % 2 === 1;

      if (building.type === "path") {
        const roadSurface = building.roadSurface ?? "dirt";
        const roadTexture = ROAD_TEXTURES[roadSurface];
        const texture = Assets.get(roadTexture.src);
        const sprite = new Sprite(texture);
        const pos = isoToWorld(building.x, building.y);
        const scale =
          (TILE_WIDTH / roadTexture.visibleWidth) * roadTexture.overscan;
        const offsetX = roadTexture.offsetX * scale;
        const offsetY = roadTexture.offsetY * scale;
        const mirroredScale = isMirrored ? -scale : scale;
        const positionOffsetX = isMirrored ? -offsetX : offsetX;

        sprite.anchor.set(0.5);
        sprite.position.set(pos.x - positionOffsetX, pos.y - offsetY);
        sprite.scale.set(mirroredScale, scale);

        this.roadsContainer.addChild(sprite);
        continue;
      }

      if (
        building.type !== "cabin" &&
        building.type !== "house" &&
        !("type" in building && building.type in GREENERY_TEXTURES)
      ) {
        continue;
      }

      const fenceStyle =
        building.type === "fence"
          ? resolveFenceStyle(building as GreeneryPlacement, fenceKeys)
          : null;

      const buildingTexture =
        fenceStyle?.texture ??
        (building.type in GREENERY_TEXTURES
          ? GREENERY_TEXTURES[building.type as GreeneryType]
          : building.type === "house"
            ? HOUSE_TEXTURE
            : orientation >= 2
              ? CABIN_BACK_TEXTURE
              : CABIN_TEXTURE);

      const texture = Assets.get(buildingTexture.src);
      const sprite = new Sprite(texture);
      const pos = isoToWorld(building.x, building.y);
      const scale =
        (TILE_WIDTH / buildingTexture.visibleWidth) * buildingTexture.overscan;
      const offsetX = buildingTexture.offsetX * scale;
      const offsetY = buildingTexture.offsetY * scale;
      const shouldMirror = fenceStyle ? fenceStyle.mirrored : isMirrored;
      const mirroredScale = shouldMirror ? -scale : scale;
      const positionOffsetX = shouldMirror ? -offsetX : offsetX;

      sprite.anchor.set(
        buildingTexture.footprintCenterX,
        buildingTexture.footprintBaseY,
      );
      sprite.position.set(pos.x + positionOffsetX, pos.y + offsetY);
      sprite.scale.set(mirroredScale, scale);
      sprite.rotation = fenceStyle?.rotation ?? 0;

      this.housesContainer.addChild(sprite);
    }
  }
}
