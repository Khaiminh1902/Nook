import Camera from "./Camera";
import Mouse from "./Mouse";

import { worldToIso } from "@/utils/iso";

export default class TilePicker {
  constructor(
    private camera: Camera,
    private mouse: Mouse,
  ) {}

  getHoveredTile(screenWidth: number, screenHeight: number) {
    const world = this.camera.screenToWorld(
      this.mouse.x,
      this.mouse.y,
      screenWidth,
      screenHeight,
    );

    const iso = worldToIso(world.x, world.y);

    return {
      // Tile centers live on integer isometric coordinates, so hover
      // selection should snap to the nearest tile instead of flooring.
      x: Math.round(iso.tileX),
      y: Math.round(iso.tileY),
    };
  }
}
