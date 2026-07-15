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

const TREE_TEXTURES: Record<
  GreeneryType,
  {
    src: string;
    visibleWidth: number;
    footprintCenterX: number;
    footprintBaseY: number;
    offsetX: number;
    offsetY: number;
    overscan: number;
  }
> = {
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
} as const;

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
        !("type" in building && building.type in TREE_TEXTURES)
      ) {
        continue;
      }

      const buildingTexture =
        building.type in TREE_TEXTURES
          ? TREE_TEXTURES[building.type as GreeneryType]
          : building.type === "house"
            ? HOUSE_TEXTURE
            : orientation >= 2
              ? CABIN_BACK_TEXTURE
              : CABIN_TEXTURE;

      const texture = Assets.get(buildingTexture.src);
      const sprite = new Sprite(texture);
      const pos = isoToWorld(building.x, building.y);
      const scale =
        (TILE_WIDTH / buildingTexture.visibleWidth) * buildingTexture.overscan;
      const offsetX = buildingTexture.offsetX * scale;
      const offsetY = buildingTexture.offsetY * scale;
      const mirroredScale = isMirrored ? -scale : scale;
      const positionOffsetX = isMirrored ? -offsetX : offsetX;

      sprite.anchor.set(
        buildingTexture.footprintCenterX,
        buildingTexture.footprintBaseY,
      );
      sprite.position.set(pos.x + positionOffsetX, pos.y + offsetY);
      sprite.scale.set(mirroredScale, scale);

      this.housesContainer.addChild(sprite);
    }
  }
}
