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
      x: Math.floor(iso.tileX),
      y: Math.floor(iso.tileY),
    };
  }
}
