import { Container } from "pixi.js";

import Camera from "@/engine/Camera";
import ChunkManager from "@/engine/ChunkManager";
import Mouse from "@/engine/Mouse";
import World from "@/engine/World";
import TerrainRenderer from "./TerrainRenderer";
import { worldToIso } from "@/utils/iso";

export default class GameScene {
  public readonly root = new Container();

  private worldContainer = new Container();

  private world = new World();

  private terrainRenderer = new TerrainRenderer();

  private chunkManager = new ChunkManager(
    this.world,
    this.terrainRenderer,
    this.camera,
  );

  constructor(
    private camera: Camera,
    private mouse: Mouse,
  ) {
    this.root.addChild(this.worldContainer);

    this.worldContainer.addChild(this.terrainRenderer.container);
  }

  update(screenWidth: number, screenHeight: number) {
    this.chunkManager.update();

    this.worldContainer.position.set(screenWidth / 2, screenHeight / 2);

    this.worldContainer.pivot.set(this.camera.getX(), this.camera.getY());

    this.worldContainer.scale.set(this.camera.getZoom());

    // TEMP: Mouse → Tile test
    const world = this.camera.screenToWorld(
      this.mouse.x,
      this.mouse.y,
      screenWidth,
      screenHeight,
    );

    const iso = worldToIso(world.x, world.y);

    console.log(Math.floor(iso.tileX), Math.floor(iso.tileY));
  }
}
