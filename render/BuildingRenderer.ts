import { Assets, Container, Sprite } from "pixi.js";

import { TILE_WIDTH } from "@/engine/constants";
import { BuildingPlacement } from "@/store/gameStore";
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

export default class BuildingRenderer {
  public readonly container = new Container();
  public readonly roadsContainer = new Container();
  public readonly housesContainer = new Container();

  constructor() {
    this.container.addChild(this.roadsContainer);
    this.container.addChild(this.housesContainer);
  }

  sync(buildings: BuildingPlacement[]) {
    this.roadsContainer.removeChildren().forEach((child) => child.destroy());
    this.housesContainer.removeChildren().forEach((child) => child.destroy());

    const sortedBuildings = [...buildings].sort((a, b) => {
      const aPos = isoToWorld(a.x, a.y);
      const bPos = isoToWorld(b.x, b.y);

      if (aPos.y !== bPos.y) return aPos.y - bPos.y;

      return aPos.x - bPos.x;
    });

    for (const building of sortedBuildings) {
      const orientation = building.orientation ?? (building.mirrored ? 1 : 0);
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

        sprite.anchor.set(0.5);
        sprite.position.set(pos.x - offsetX, pos.y - offsetY);
        sprite.scale.set(mirroredScale, scale);

        this.roadsContainer.addChild(sprite);
        continue;
      }

      if (building.type !== "cabin" && building.type !== "house") continue;

      const buildingTexture =
        building.type === "house"
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

      sprite.anchor.set(
        buildingTexture.footprintCenterX,
        buildingTexture.footprintBaseY,
      );
      sprite.position.set(pos.x + offsetX, pos.y + offsetY);
      sprite.scale.set(mirroredScale, scale);

      this.housesContainer.addChild(sprite);
    }
  }
}
