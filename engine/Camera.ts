export default class Camera {
  private x = 0;
  private y = 0;

  private targetX = 0;
  private targetY = 0;

  private zoom = 0.5;
  private targetZoom = 0.5;

  private readonly PAN_SMOOTHNESS = 0.15;
  private readonly ZOOM_SMOOTHNESS = 0.15;

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getZoom() {
    return this.zoom;
  }

  move(dx: number, dy: number) {
    this.targetX += dx;
    this.targetY += dy;
  }

  setPosition(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  zoomBy(amount: number) {
    this.targetZoom = Math.max(0.25, Math.min(2.5, this.targetZoom + amount));
  }

  update() {
    this.x += (this.targetX - this.x) * this.PAN_SMOOTHNESS;
    this.y += (this.targetY - this.y) * this.PAN_SMOOTHNESS;

    this.zoom += (this.targetZoom - this.zoom) * this.ZOOM_SMOOTHNESS;
  }

  screenToWorld(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
  ) {
    return {
      x: (screenX - screenWidth / 2) / this.zoom + this.x,
      y: (screenY - screenHeight / 2) / this.zoom + this.y,
    };
  }
}
