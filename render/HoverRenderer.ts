import { Assets, Container, Sprite } from "pixi.js";
import { isoToWorld } from "@/utils/iso";

export default class HoverRenderer {
  public readonly container = new Container();

  private sprite: Sprite;

  constructor() {
    const texture = Assets.get("/assets/game/highlight.png");

    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);
    this.sprite.visible = false;

    this.container.addChild(this.sprite);
  }

  setTile(x: number, y: number) {
    const pos = isoToWorld(x, y);

    this.sprite.position.set(pos.x, pos.y);
    this.sprite.visible = true;
  }

  clear() {
    this.sprite.visible = false;
  }
}
