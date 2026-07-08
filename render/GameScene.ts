import { Container } from "pixi.js";

import Camera from "@/engine/Camera";
import ChunkManager from "@/engine/ChunkManager";
import Mouse from "@/engine/Mouse";
import World from "@/engine/World";
import TerrainRenderer from "./TerrainRenderer";
import { worldToIso } from "@/utils/iso";
import HoverRenderer from "./HoverRenderer";
import TilePicker from "@/engine/TilePicker";

export default class GameScene {
  public readonly root = new Container();

  private worldContainer = new Container();

  private world = new World();

  private terrainRenderer = new TerrainRenderer();

  private hoverRenderer = new HoverRenderer();

  private picker = new TilePicker(this.camera, this.mouse);

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
    this.worldContainer.addChild(this.hoverRenderer.container);
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

    const tile = this.picker.getHoveredTile(screenWidth, screenHeight);

    this.hoverRenderer.setTile(tile.x, tile.y);
  }
}
