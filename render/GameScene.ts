import { Container, Graphics } from "pixi.js";

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
import AreaSelectionRenderer from "./AreaSelectionRenderer";
import type { LightingMode, TilePosition } from "@/store/gameStore";

const NIGHT_OVERLAY_ALPHA = 0.38;

export default class GameScene {
  public readonly root = new Container();

  private worldContainer = new Container();

  private lightingOverlay = new Graphics();

  private world = new World();

  private terrainRenderer = new TerrainRenderer();

  private decorationRenderer = new DecorationRenderer();

  private hoverRenderer = new HoverRenderer();

  private selectionRenderer = new HoverRenderer();

  private areaSelectionRenderer = new AreaSelectionRenderer();

  private buildingRenderer = new BuildingRenderer();

  private picker = new TilePicker(this.camera, this.mouse);

  private selectionManager = new SelectionManager();

  private chunkManager = new ChunkManager(
    this.world,
    this.terrainRenderer,
    this.decorationRenderer,
    this.camera,
  );

  private areaSelectionStart: TilePosition | null = null;

  private areaSelectionEnd: TilePosition | null = null;

  private lightingMode: LightingMode = useGameStore.getState().lightingMode;

  constructor(
    private camera: Camera,
    private mouse: Mouse,
  ) {
    this.root.addChild(this.worldContainer);

    this.worldContainer.addChild(this.terrainRenderer.container);
    this.worldContainer.addChild(this.decorationRenderer.container);
    this.worldContainer.addChild(this.buildingRenderer.roadsContainer);
    this.worldContainer.addChild(this.hoverRenderer.container);
    this.worldContainer.addChild(this.areaSelectionRenderer.container);
    this.worldContainer.addChild(this.selectionRenderer.container);
    this.worldContainer.addChild(this.buildingRenderer.housesContainer);

    this.lightingOverlay.eventMode = "none";
    this.root.addChild(this.lightingOverlay);
  }

  update(screenWidth: number, screenHeight: number) {
    this.chunkManager.update();

    this.worldContainer.position.set(screenWidth / 2, screenHeight / 2);

    this.worldContainer.pivot.set(this.camera.getX(), this.camera.getY());

    this.worldContainer.scale.set(this.camera.getZoom());

    this.lightingMode = useGameStore.getState().lightingMode;
    this.updateLighting(screenWidth, screenHeight);

    const tile = this.picker.getHoveredTile(screenWidth, screenHeight);

    this.hoverRenderer.setTile(tile.x, tile.y);

    const selectedTile = this.selectionManager.getSelected();
    const selectedArea = useGameStore.getState().selectedArea;

    if (selectedTile) {
      this.selectionRenderer.setTile(selectedTile.x, selectedTile.y);
    } else {
      this.selectionRenderer.clear();
    }

    if (this.areaSelectionStart && this.areaSelectionEnd) {
      this.areaSelectionRenderer.setArea(
        this.areaSelectionStart,
        this.areaSelectionEnd,
      );
    } else if (selectedArea) {
      this.areaSelectionRenderer.setArea(
        selectedArea.start,
        selectedArea.end,
      );
    } else {
      this.areaSelectionRenderer.clear();
    }

    const { buildings, greenery } = useGameStore.getState();
    this.buildingRenderer.sync(buildings, greenery);
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
    useGameStore.getState().setSelectedArea(null);
  }

  beginAreaSelection(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
  ): boolean {
    const tile = this.picker.getTileAtScreenPosition(
      screenX,
      screenY,
      screenWidth,
      screenHeight,
    );

    this.areaSelectionStart = tile;
    this.areaSelectionEnd = tile;
    return true;
  }

  updateAreaSelection(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
  ) {
    if (!this.areaSelectionStart) return;

    this.areaSelectionEnd = this.picker.getTileAtScreenPosition(
      screenX,
      screenY,
      screenWidth,
      screenHeight,
    );
  }

  finishAreaSelection() {
    if (!this.areaSelectionStart || !this.areaSelectionEnd) {
      this.clearDragAreaSelection();
      return;
    }

    useGameStore.getState().setSelectedArea({
      start: this.areaSelectionStart,
      end: this.areaSelectionEnd,
    });

    this.clearDragAreaSelection();
  }

  clearDragAreaSelection() {
    this.areaSelectionStart = null;
    this.areaSelectionEnd = null;
  }

  clearAreaSelection() {
    this.clearDragAreaSelection();
    this.areaSelectionRenderer.clear();
    useGameStore.getState().setSelectedArea(null);
  }

  destroy() {}

  private updateLighting(screenWidth: number, screenHeight: number) {
    const isNight = this.resolveNightState();

    this.lightingOverlay.clear();

    if (!isNight) return;

    this.lightingOverlay
      .rect(0, 0, screenWidth, screenHeight)
      .fill({ color: 0x0f1b35, alpha: NIGHT_OVERLAY_ALPHA });
  }

  private resolveNightState() {
    if (this.lightingMode === "night") return true;
    if (this.lightingMode === "day") return false;

    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour >= 18;
  }
}
