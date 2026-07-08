export enum TerrainType {
  Grass = "grass",
}

export enum DecorationType {
  None = "none",
  Flowers = "flowers",
  Rock = "rock",
  Clover = "clover",
}

export interface Tile {
  x: number;
  y: number;

  terrain: TerrainType;

  decoration: DecorationType;
}
