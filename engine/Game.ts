// src/engine/Game.ts

import { Application, Container, Ticker, Assets } from "pixi.js";
import GameScene from "@/render/GameScene";
import Camera from "./Camera";
import Input from "./Input";
import Mouse from "./Mouse";
export default class Game {
  private app!: Application;
  private world = new Container();
  private camera = new Camera();
  private scene!: GameScene;
  private input!: Input;
  private mouse!: Mouse;

  constructor(private container: HTMLDivElement) {}

  /**
   * =========================================
   * Initialize
   * =========================================
   */
  async init() {
    this.app = new Application();

    await this.app.init({
      resizeTo: window,
      background: "#8fd16a",
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    await Assets.load("/assets/game/grass.png");
    await Assets.load("/assets/game/highlight.png");

    this.input = new Input(this.camera, this.app.canvas);

    this.mouse = new Mouse(this.app.canvas);

    this.scene = new GameScene(this.camera, this.mouse);

    this.container.appendChild(this.app.canvas);

    this.app.stage.addChild(this.scene.root);

    this.scene.update(this.app.screen.width, this.app.screen.height);

    this.app.ticker.add(this.update);

    window.addEventListener("resize", this.onResize);
  }

  /**
   * =========================================
   * Game Loop
   * =========================================
   */
  private update = (ticker: Ticker) => {
    this.camera.update();

    this.scene.update(this.app.screen.width, this.app.screen.height);
  };

  /**
   * =========================================
   * Resize
   * =========================================
   */
  private onResize = () => {
    // Pixi handles resizeTo: window automatically.
    // This method will become useful later.
  };

  /**
   * =========================================
   * Cleanup
   * =========================================
   */
  destroy() {
    window.removeEventListener("resize", this.onResize);

    this.app.ticker.remove(this.update);

    this.input.destroy();
    this.app.destroy(true, {
      children: true,
    });
  }
}
