import { DecorationType, TerrainType, Tile } from "./Tile";
import { random2D } from "@/utils/random";

export function generateTile(x: number, y: number): Tile {
  const r = random2D(x, y);

  let decoration = DecorationType.None;

  if (r < 0.2) decoration = DecorationType.Tile1;
  else if (r < 0.3) decoration = DecorationType.Tile2;
  else if (r < 0.4) decoration = DecorationType.Tile3;

  return {
    x,
    y,
    terrain: TerrainType.Grass,
    decoration,
  };
}
