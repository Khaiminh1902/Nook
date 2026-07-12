import { Assets, Container, Sprite } from "pixi.js";

import { isoToWorld } from "@/utils/iso";

import type { TilePosition } from "@/store/gameStore";

export default class AreaSelectionRenderer {
  public readonly container = new Container();

  setArea(start: TilePosition, end: TilePosition, alpha = 0.55) {
    this.clear();

    const texture = Assets.get("/assets/game/highlight.png");
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const sprite = new Sprite(texture);
        const pos = isoToWorld(x, y);

        sprite.anchor.set(0.5);
        sprite.position.set(pos.x, pos.y);
        sprite.alpha = alpha;

        this.container.addChild(sprite);
      }
    }
  }

  clear() {
    this.container.removeChildren().forEach((child) => child.destroy());
  }
}
