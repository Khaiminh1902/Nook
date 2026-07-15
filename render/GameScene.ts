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
import { isoToWorld } from "@/utils/iso";

const NIGHT_OVERLAY_ALPHA = 0.6;
const STREET_LAMP_LIGHT_LAYERS = [
  { radius: 420, alpha: 0.18 },
  { radius: 360, alpha: 0.14 },
  { radius: 300, alpha: 0.11 },
  { radius: 240, alpha: 0.08 },
  { radius: 185, alpha: 0.05 },
  { radius: 135, alpha: 0.03 },
  { radius: 95, alpha: 0.015 },
] as const;

export default class GameScene {
  public readonly root = new Container();

  private worldContainer = new Container();

  private lightingOverlays = STREET_LAMP_LIGHT_LAYERS.map(() => new Graphics());

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

    for (const overlay of this.lightingOverlays) {
      overlay.eventMode = "none";
      this.root.addChild(overlay);
    }
  }

  update(screenWidth: number, screenHeight: number) {
    this.chunkManager.update();

    this.worldContainer.position.set(screenWidth / 2, screenHeight / 2);
    this.worldContainer.pivot.set(this.camera.getX(), this.camera.getY());
    this.worldContainer.scale.set(this.camera.getZoom());

    this.lightingMode = useGameStore.getState().lightingMode;
    const { buildings, greenery } = useGameStore.getState();
    this.updateLighting(screenWidth, screenHeight, greenery);

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
      this.areaSelectionRenderer.setArea(selectedArea.start, selectedArea.end);
    } else {
      this.areaSelectionRenderer.clear();
    }

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

  private updateLighting(
    screenWidth: number,
    screenHeight: number,
    greenery: Array<{ x: number; y: number; type: string }>,
  ) {
    const isNight = this.resolveNightState();

    for (const overlay of this.lightingOverlays) {
      overlay.clear();
    }

    if (!isNight) return;

    STREET_LAMP_LIGHT_LAYERS.forEach((layer, index) => {
      const overlay = this.lightingOverlays[index];
      const overlayPadding = layer.radius * this.camera.getZoom() + 32;

      overlay
        .rect(
          -overlayPadding,
          -overlayPadding,
          screenWidth + overlayPadding * 2,
          screenHeight + overlayPadding * 2,
        )
        .fill({
          color: 0x0f1b35,
          alpha: index === 0 ? NIGHT_OVERLAY_ALPHA : layer.alpha,
        });
    });

    for (const item of greenery) {
      if (item.type !== "streetLamp") continue;

      const { x, y } = isoToWorld(item.x, item.y);
      const screenX =
        (x - this.camera.getX()) * this.camera.getZoom() + screenWidth / 2;
      const screenY =
        (y - 180 - this.camera.getY()) * this.camera.getZoom() +
        screenHeight / 2;

      STREET_LAMP_LIGHT_LAYERS.forEach((layer, index) => {
        const overlay = this.lightingOverlays[index];

        overlay.circle(screenX, screenY, layer.radius * this.camera.getZoom());
        overlay.cut();
      });
    }
  }

  private resolveNightState() {
    if (this.lightingMode === "night") return true;
    if (this.lightingMode === "day") return false;

    const currentHour = new Date().getHours();
    return currentHour < 6 || currentHour >= 18;
  }
}
