import { STEP_X, STEP_Y } from "@/engine/constants";

export function isoToWorld(tileX: number, tileY: number) {
  return {
    x: (tileX - tileY) * STEP_X,
    y: (tileX + tileY) * STEP_Y,
  };
}

export function worldToIso(worldX: number, worldY: number) {
  return {
    tileX: (worldX / STEP_X + worldY / STEP_Y) / 2,
    tileY: (worldY / STEP_Y - worldX / STEP_X) / 2,
  };
}
