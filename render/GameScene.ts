import { Container } from "pixi.js";

import Camera from "@/engine/Camera";
import ChunkManager from "@/engine/ChunkManager";
import Mouse from "@/engine/Mouse";
import World from "@/engine/World";
import TerrainRenderer from "./TerrainRenderer";
import HoverRenderer from "./HoverRenderer";
import TilePicker from "@/engine/TilePicker";
import DecorationRenderer from "./DecorationRenderer";
import SelectionManager from "@/engine/SelectionManager";
import BuildingRenderer from "./BuildingRenderer";
import { useGameStore } from "@/store/gameStore";

export default class GameScene {
  public readonly root = new Container();

  private worldContainer = new Container();

  private world = new World();

  private terrainRenderer = new TerrainRenderer();

  private decorationRenderer = new DecorationRenderer();

  private hoverRenderer = new HoverRenderer();

  private selectionRenderer = new HoverRenderer();

  private buildingRenderer = new BuildingRenderer();

  private picker = new TilePicker(this.camera, this.mouse);

  private selectionManager = new SelectionManager();

  private chunkManager = new ChunkManager(
    this.world,
    this.terrainRenderer,
    this.decorationRenderer,
    this.camera,
  );

  constructor(
    private camera: Camera,
    private mouse: Mouse,
  ) {
    this.root.addChild(this.worldContainer);

    this.worldContainer.addChild(this.terrainRenderer.container);
    this.worldContainer.addChild(this.decorationRenderer.container);
    this.worldContainer.addChild(this.hoverRenderer.container);
    this.worldContainer.addChild(this.selectionRenderer.container);
    this.worldContainer.addChild(this.buildingRenderer.container);
  }

  update(screenWidth: number, screenHeight: number) {
    this.chunkManager.update();

    this.worldContainer.position.set(screenWidth / 2, screenHeight / 2);

    this.worldContainer.pivot.set(this.camera.getX(), this.camera.getY());

    this.worldContainer.scale.set(this.camera.getZoom());

    const tile = this.picker.getHoveredTile(screenWidth, screenHeight);

    this.hoverRenderer.setTile(tile.x, tile.y);

    const selectedTile = this.selectionManager.getSelected();

    if (selectedTile) {
      this.selectionRenderer.setTile(selectedTile.x, selectedTile.y);
    } else {
      this.selectionRenderer.clear();
    }

    this.buildingRenderer.sync(useGameStore.getState().buildings);
  }

  selectTileAt(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
  ) {
    const tile = this.picker.getTileAtScreenPosition(
      screenX,
      screenY,
      screenWidth,
      screenHeight,
    );

    this.selectionManager.toggle(tile.x, tile.y);
  }
}
