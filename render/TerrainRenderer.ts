import { Assets, Container, Sprite } from "pixi.js";

import Chunk from "@/engine/Chunk";
import { isoToWorld } from "@/utils/iso";

export default class TerrainRenderer {
  public readonly container = new Container();

  private chunkContainers = new Map<string, Container>();

  renderChunk(chunk: Chunk) {
    const key = `${chunk.chunkX},${chunk.chunkY}`;

    if (this.chunkContainers.has(key)) return;

    const chunkContainer = new Container();

    const texture = Assets.get("/assets/game/grass.png");

    for (const tile of chunk.tiles) {
      const sprite = new Sprite(texture);

      sprite.anchor.set(0.5);

      const pos = isoToWorld(tile.x, tile.y);

      sprite.position.set(pos.x, pos.y);

      chunkContainer.addChild(sprite);
    }

    this.chunkContainers.set(key, chunkContainer);
    this.container.addChild(chunkContainer);
  }

  removeChunk(chunk: Chunk) {
    const key = `${chunk.chunkX},${chunk.chunkY}`;

    const container = this.chunkContainers.get(key);

    if (!container) return;

    container.destroy({
      children: true,
    });

    this.chunkContainers.delete(key);
  }

  clear() {
    this.container.removeChildren();
    this.chunkContainers.clear();
  }
}
