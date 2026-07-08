import { Assets, Container, Sprite } from "pixi.js";

import Chunk from "@/engine/Chunk";
import { isoToWorld } from "@/utils/iso";
import { DecorationType } from "@/engine/Tile";

export default class DecorationRenderer {
  public readonly container = new Container();

  private chunkContainers = new Map<string, Container>();

  renderChunk(chunk: Chunk) {
    const key = `${chunk.chunkX},${chunk.chunkY}`;

    if (this.chunkContainers.has(key)) return;

    const chunkContainer = new Container();

    for (const tile of chunk.tiles) {
      if (tile.decoration === DecorationType.None) continue;

      let texture;

      switch (tile.decoration) {
        case DecorationType.Flowers:
          texture = Assets.get("/assets/game/grass2.png");
          break;

        case DecorationType.Rock:
          texture = Assets.get("/assets/game/grass3.png");
          break;

        case DecorationType.Clover:
          texture = Assets.get("/assets/game/grass4.png");
          break;

        default:
          continue;
      }

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
}
