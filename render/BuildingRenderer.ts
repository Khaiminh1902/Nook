import { Assets, Container, Sprite } from "pixi.js";

import { TILE_WIDTH } from "@/engine/constants";
import { BuildingPlacement } from "@/store/gameStore";
import { isoToWorld } from "@/utils/iso";

const ROAD_TEXTURES = {
  dirt: {
    src: "/assets/road/dirt.png",
    visibleWidth: 1150,
    offsetX: 5,
    offsetY: 4,
    overscan: 1,
  },
  concrete: {
    src: "/assets/road/concrete.png",
    visibleWidth: 855,
    offsetX: -10,
    offsetY: 34,
    overscan: 1,
  },
} as const;

const HOUSE_TEXTURE = {
  src: "/assets/buildings/cabin.png",
  visibleWidth: 1120,
  footprintCenterX: 934.5 / 1920,
  footprintBaseY: 997 / 1080,
  offsetX: -14,
  offsetY: -12,
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

        sprite.anchor.set(0.5);
        sprite.position.set(pos.x - offsetX, pos.y - offsetY);
        sprite.scale.set(scale, scale);

        this.roadsContainer.addChild(sprite);
        continue;
      }

      if (building.type !== "house") continue;

      const texture = Assets.get(HOUSE_TEXTURE.src);
      const sprite = new Sprite(texture);
      const pos = isoToWorld(building.x, building.y);
      const scale =
        (TILE_WIDTH / HOUSE_TEXTURE.visibleWidth) * HOUSE_TEXTURE.overscan;
      const offsetX = HOUSE_TEXTURE.offsetX * scale;
      const offsetY = HOUSE_TEXTURE.offsetY * scale;

      sprite.anchor.set(
        HOUSE_TEXTURE.footprintCenterX,
        HOUSE_TEXTURE.footprintBaseY,
      );
      sprite.position.set(pos.x + offsetX, pos.y + offsetY);
      sprite.scale.set(scale);

      this.housesContainer.addChild(sprite);
    }
  }
}
