import Camera from "./Camera";
import Mouse from "./Mouse";

import { worldToIso } from "@/utils/iso";

export default class TilePicker {
  constructor(
    private camera: Camera,
    private mouse: Mouse,
  ) {}

  getHoveredTile(screenWidth: number, screenHeight: number) {
    return this.getTileAtScreenPosition(
      this.mouse.x,
      this.mouse.y,
      screenWidth,
      screenHeight,
    );
  }

  getTileAtScreenPosition(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
  ) {
    const world = this.camera.screenToWorld(
      screenX,
      screenY,
      screenWidth,
      screenHeight,
    );

    const iso = worldToIso(world.x, world.y);

    return {
      x: Math.round(iso.tileX),
      y: Math.round(iso.tileY),
    };
  }
}
