import { Assets, Container, Sprite } from "pixi.js";

import { STEP_X, STEP_Y, TILE_WIDTH } from "@/engine/constants";
import { BuildingPlacement } from "@/store/gameStore";
import { isoToWorld } from "@/utils/iso";

export default class BuildingRenderer {
  public readonly container = new Container();

  sync(buildings: BuildingPlacement[]) {
    this.container.removeChildren().forEach((child) => child.destroy());

    const sortedBuildings = [...buildings].sort((a, b) => {
      const aPos = isoToWorld(a.x, a.y);
      const bPos = isoToWorld(b.x, b.y);

      if (aPos.y !== bPos.y) return aPos.y - bPos.y;

      return aPos.x - bPos.x;
    });

    for (const building of sortedBuildings) {
      if (building.type !== "house") continue;

      const texture = Assets.get("/assets/buildings/house.png");
      const sprite = new Sprite(texture);
      const pos = isoToWorld(building.x, building.y);
      const scale = TILE_WIDTH / texture.width;
      const offsetX = STEP_X * -0.02;
      const offsetY = -STEP_Y * 0.4;

      sprite.anchor.set(0.5, 0.5);
      sprite.position.set(pos.x + offsetX, pos.y + offsetY);
      sprite.scale.set(scale);

      this.container.addChild(sprite);
    }
  }
}
