import Chunk from "./Chunk";

export default class World {
  private chunks = new Map<string, Chunk>();

  constructor() {
    this.loadChunk(0, 0);
  }

  loadChunk(chunkX: number, chunkY: number): Chunk {
    const key = `${chunkX},${chunkY}`;

    let chunk = this.chunks.get(key);

    if (!chunk) {
      chunk = new Chunk(chunkX, chunkY);
      this.chunks.set(key, chunk);
    }

    return chunk;
  }

  getChunks(): Iterable<Chunk> {
    return this.chunks.values();
  }
}
