export default class Mouse {
  x = 0;
  y = 0;

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();

      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    });
  }
}
