import Camera from "./Camera";

export default class Input {
  private panning = false;
  private movedWhilePanning = false;
  private areaSelecting = false;

  private lastX = 0;
  private lastY = 0;

  private readonly CLICK_DRAG_THRESHOLD = 6;

  constructor(
    private camera: Camera,
    private canvas: HTMLCanvasElement,
    private onTileClick: (screenX: number, screenY: number) => void,
    private onAreaSelectionStart: (screenX: number, screenY: number) => boolean,
    private onAreaSelectionMove: (screenX: number, screenY: number) => void,
    private onAreaSelectionEnd: () => void,
  ) {
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("contextmenu", this.onContextMenu);
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);

    this.canvas.addEventListener("wheel", this.onWheel, {
      passive: false,
    });
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.canvas.removeEventListener("contextmenu", this.onContextMenu);

    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  private onMouseDown = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (e.button === 0) {
      this.panning = true;
      this.movedWhilePanning = false;

      this.lastX = e.clientX;
      this.lastY = e.clientY;
      return;
    }

    if (e.button !== 2) return;

    this.areaSelecting = this.onAreaSelectionStart(localX, localY);
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) {
      if (!this.panning) return;

      if (!this.movedWhilePanning) {
        const rect = this.canvas.getBoundingClientRect();

        this.onTileClick(e.clientX - rect.left, e.clientY - rect.top);
      }

      this.panning = false;
      this.movedWhilePanning = false;
      return;
    }

    if (e.button !== 2 || !this.areaSelecting) return;

    this.areaSelecting = false;
    this.onAreaSelectionEnd();
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.areaSelecting) {
      const rect = this.canvas.getBoundingClientRect();

      this.onAreaSelectionMove(e.clientX - rect.left, e.clientY - rect.top);
    }

    if (!this.panning) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    if (Math.abs(dx) > this.CLICK_DRAG_THRESHOLD || Math.abs(dy) > this.CLICK_DRAG_THRESHOLD) {
      this.movedWhilePanning = true;
    }

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    const DRAG_SPEED = 1.0;

    this.camera.move(
      (-dx * DRAG_SPEED) / this.camera.getZoom(),
      (-dy * DRAG_SPEED) / this.camera.getZoom(),
    );
  };

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const ZOOM_SPEED = 0.0015;

    this.camera.zoomBy(-e.deltaY * ZOOM_SPEED);
  };
}
