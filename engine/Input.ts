import Camera from "./Camera";

export default class Input {
  private dragging = false;

  private lastX = 0;
  private lastY = 0;

  constructor(
    private camera: Camera,
    private canvas: HTMLCanvasElement,
  ) {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);

    this.canvas.addEventListener("wheel", this.onWheel, {
      passive: false,
    });
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("wheel", this.onWheel);

    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;

    this.dragging = true;

    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onMouseUp = () => {
    this.dragging = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    const DRAG_SPEED = 1.0;

    this.camera.move(
      (-dx * DRAG_SPEED) / this.camera.getZoom(),
      (-dy * DRAG_SPEED) / this.camera.getZoom(),
    );
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const ZOOM_SPEED = 0.0015;

    this.camera.zoomBy(-e.deltaY * ZOOM_SPEED);
  };
}
