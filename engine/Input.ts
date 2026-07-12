import Camera from "./Camera";

export default class Input {
  private panning = false;
  private movedWhilePanning = false;
  private areaSelecting = false;
  private areaSelectionMouseX = 0;
  private areaSelectionMouseY = 0;

  private lastX = 0;
  private lastY = 0;

  private readonly CLICK_DRAG_THRESHOLD = 6;
  private readonly EDGE_PAN_MARGIN = 48;
  private readonly EDGE_PAN_SPEED = 12;
  private edgePanFrame: number | null = null;

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

    if (this.edgePanFrame !== null) {
      cancelAnimationFrame(this.edgePanFrame);
      this.edgePanFrame = null;
    }
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

    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.areaSelectionMouseX = localX;
    this.areaSelectionMouseY = localY;
    this.areaSelecting = this.onAreaSelectionStart(localX, localY);

    if (this.areaSelecting) {
      this.startAreaSelectionEdgePan();
    }
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
    this.stopAreaSelectionEdgePan();
    this.onAreaSelectionEnd();
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.areaSelecting) {
      const rect = this.canvas.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      this.areaSelectionMouseX = localX;
      this.areaSelectionMouseY = localY;
      this.onAreaSelectionMove(localX, localY);
      return;
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

  private applyAreaSelectionEdgePan(width: number, height: number) {
    let moveX = 0;
    let moveY = 0;

    if (this.areaSelectionMouseX <= this.EDGE_PAN_MARGIN) {
      moveX = -this.EDGE_PAN_SPEED;
    } else if (this.areaSelectionMouseX >= width - this.EDGE_PAN_MARGIN) {
      moveX = this.EDGE_PAN_SPEED;
    }

    if (this.areaSelectionMouseY <= this.EDGE_PAN_MARGIN) {
      moveY = -this.EDGE_PAN_SPEED;
    } else if (this.areaSelectionMouseY >= height - this.EDGE_PAN_MARGIN) {
      moveY = this.EDGE_PAN_SPEED;
    }

    if (moveX === 0 && moveY === 0) return;

    this.camera.move(
      moveX / this.camera.getZoom(),
      moveY / this.camera.getZoom(),
    );

    this.onAreaSelectionMove(
      this.areaSelectionMouseX,
      this.areaSelectionMouseY,
    );
  }

  private startAreaSelectionEdgePan() {
    if (this.edgePanFrame !== null) return;

    const tick = () => {
      if (!this.areaSelecting) {
        this.edgePanFrame = null;
        return;
      }

      const rect = this.canvas.getBoundingClientRect();

      this.applyAreaSelectionEdgePan(rect.width, rect.height);
      this.edgePanFrame = requestAnimationFrame(tick);
    };

    this.edgePanFrame = requestAnimationFrame(tick);
  }

  private stopAreaSelectionEdgePan() {
    if (this.edgePanFrame === null) return;

    cancelAnimationFrame(this.edgePanFrame);
    this.edgePanFrame = null;
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const ZOOM_SPEED = 0.0015;

    this.camera.zoomBy(-e.deltaY * ZOOM_SPEED);
  };
}
