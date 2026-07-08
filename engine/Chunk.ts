import { CHUNK_SIZE } from "./constants";
import { Tile } from "./Tile";
import { generateTile } from "./Generation";

export default class Chunk {
  readonly chunkX: number;
  readonly chunkY: number;

  readonly tiles: Tile[] = [];

  constructor(chunkX: number, chunkY: number) {
    this.chunkX = chunkX;
    this.chunkY = chunkY;

    for (let y = 0; y < CHUNK_SIZE; y++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const worldX = chunkX * CHUNK_SIZE + x;
        const worldY = chunkY * CHUNK_SIZE + y;

        this.tiles.push(generateTile(worldX, worldY));
      }
    }
  }

  getTile(localX: number, localY: number): Tile | undefined {
    if (
      localX < 0 ||
      localX >= CHUNK_SIZE ||
      localY < 0 ||
      localY >= CHUNK_SIZE
    ) {
      return undefined;
    }

    return this.tiles[localY * CHUNK_SIZE + localX];
  }
}
