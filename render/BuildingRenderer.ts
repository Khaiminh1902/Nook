import { Assets, Container, Sprite } from "pixi.js";

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

      sprite.anchor.set(0.5, 0.8);
      sprite.position.set(pos.x, pos.y);

      this.container.addChild(sprite);
    }
  }
}
