import Camera from "./Camera";
import TerrainRenderer from "@/render/TerrainRenderer";
import DecorationRenderer from "@/render/DecorationRenderer";
import World from "@/engine/World";

import {
  CHUNK_SIZE,
  STEP_X,
  STEP_Y,
  RENDER_DISTANCE,
} from "@/engine/constants";

export default class ChunkManager {
  private loaded = new Set<string>();

  constructor(
    private world: World,
    private terrainRenderer: TerrainRenderer,
    private decorationRenderer: DecorationRenderer,
    private camera: Camera,
  ) {}

  update() {
    const cameraTileX = Math.floor(
      (this.camera.getX() / STEP_X + this.camera.getY() / STEP_Y) / 2,
    );

    const cameraTileY = Math.floor(
      (this.camera.getY() / STEP_Y - this.camera.getX() / STEP_X) / 2,
    );

    const centerChunkX = Math.floor(cameraTileX / CHUNK_SIZE);
    const centerChunkY = Math.floor(cameraTileY / CHUNK_SIZE);

    const visible = new Set<string>();

    for (
      let cy = centerChunkY - RENDER_DISTANCE;
      cy <= centerChunkY + RENDER_DISTANCE;
      cy++
    ) {
      for (
        let cx = centerChunkX - RENDER_DISTANCE;
        cx <= centerChunkX + RENDER_DISTANCE;
        cx++
      ) {
        const key = `${cx},${cy}`;
        visible.add(key);

        if (!this.loaded.has(key)) {
          const chunk = this.world.loadChunk(cx, cy);

          this.terrainRenderer.renderChunk(chunk);
          this.decorationRenderer.renderChunk(chunk);

          this.loaded.add(key);
        }
      }
    }

    // unload old chunks
    for (const key of [...this.loaded]) {
      if (visible.has(key)) continue;

      const [cx, cy] = key.split(",").map(Number);

      const chunk = this.world.loadChunk(cx, cy);

      this.terrainRenderer.removeChunk(chunk);
      this.decorationRenderer.removeChunk(chunk);

      this.loaded.delete(key);
    }
  }
}
