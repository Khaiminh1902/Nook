// src/engine/Camera.ts

export default class Camera {
  private x = 0;
  private y = 0;
  private zoom = 1;

  readonly MIN_ZOOM = 0.5;
  readonly MAX_ZOOM = 3;

  // Position

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  // Zoom

  getZoom() {
    return this.zoom;
  }

  setZoom(value: number) {
    this.zoom = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, value));
  }

  zoomBy(amount: number) {
    this.setZoom(this.zoom + amount);
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }
}
