import { Container, Sprite, Texture, Assets } from "pixi.js";
import Camera from "@/engine/Camera";

const TILE_WIDTH = 256;
const TILE_HEIGHT = 128;

export default class GameScene {
  public readonly root = new Container();

  private world = new Container();
  private terrain = new Container();

  constructor(private camera: Camera) {
    this.root.addChild(this.world);
    this.world.addChild(this.terrain);

    this.createTestTile();
  }

  private createTestTile() {
    const texture = Assets.get("/assets/tiles/grass.png");
    const tile = new Sprite(texture);

    tile.anchor.set(0.5);

    tile.width = TILE_WIDTH;
    tile.height = TILE_HEIGHT;

    tile.position.set(0, 0);

    this.terrain.addChild(tile);
  }

  update(screenWidth: number, screenHeight: number) {
    this.world.position.set(screenWidth / 2, screenHeight / 2);

    this.world.pivot.set(this.camera.getX(), this.camera.getY());

    this.world.scale.set(this.camera.getZoom());
  }
}
