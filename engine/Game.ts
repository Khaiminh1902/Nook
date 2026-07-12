import { Application, Container, Assets } from "pixi.js";
import GameScene from "@/render/GameScene";
import Camera from "./Camera";
import Input from "./Input";
import Mouse from "./Mouse";
export default class Game {
  private app?: Application;
  private world = new Container();
  private camera = new Camera();
  private scene?: GameScene;
  private input?: Input;
  private mouse?: Mouse;
  private destroyed = false;
  private readyForDestroy = false;

  constructor(private container: HTMLDivElement) {}

  async init() {
    this.app = new Application();

    await this.app.init({
      resizeTo: window,
      background: "#8fd16a",
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    if (this.destroyed) {
      this.app.destroy(true, {
        children: true,
      });
      return;
    }

    await Assets.load([
      "/assets/game/grass.png",
      "/assets/game/grass2.png",
      "/assets/game/grass3.png",
      "/assets/game/grass4.png",
      "/assets/game/highlight.png",
      "/assets/buildings/cabin.png",
      "/assets/buildings/cabin-back.png",
      "/assets/buildings/house.png",
      "/assets/game/dirt.png",
      "/assets/game/water.png",
      "/assets/road/concrete.png",
    ]);

    if (this.destroyed) {
      this.app.destroy(true, {
        children: true,
      });
      return;
    }

    const app = this.app;

    this.mouse = new Mouse(app.canvas);

    this.scene = new GameScene(this.camera, this.mouse);
    const scene = this.scene;

    this.input = new Input(this.camera, app.canvas, (screenX, screenY) => {
      scene.selectTileAt(screenX, screenY, app.screen.width, app.screen.height);
    }, (screenX, screenY) => {
      return scene.beginAreaSelection(
        screenX,
        screenY,
        app.screen.width,
        app.screen.height,
      );
    }, (screenX, screenY) => {
      scene.updateAreaSelection(
        screenX,
        screenY,
        app.screen.width,
        app.screen.height,
      );
    }, () => {
      scene.finishAreaSelection();
    });

    this.container.appendChild(app.canvas);

    app.stage.addChild(scene.root);

    scene.update(app.screen.width, app.screen.height);

    this.app.ticker.add(this.update);
    this.readyForDestroy = true;

    window.addEventListener("resize", this.onResize);

    if (this.destroyed) {
      this.destroy();
    }
  }

  private update = () => {
    if (!this.app || !this.scene) return;

    this.camera.update();

    this.scene.update(this.app.screen.width, this.app.screen.height);
  };

  private onResize = () => {};

  destroy() {
    if (this.destroyed && !this.readyForDestroy) return;

    this.destroyed = true;

    window.removeEventListener("resize", this.onResize);

    if (!this.readyForDestroy) return;

    this.app?.ticker?.remove(this.update);

    this.input?.destroy();
    this.app?.destroy(true, {
      children: true,
    });

    this.input = undefined;
    this.scene = undefined;
    this.mouse = undefined;
    this.app = undefined;
    this.readyForDestroy = false;
  }
}
