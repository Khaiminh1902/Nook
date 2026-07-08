export enum TerrainType {
  Grass = "grass",
}

export enum DecorationType {
  None = "none",
  Tile1 = "Tile1",
  Tile2 = "Tile2",
  Tile3 = "Tile3",
}

export interface Tile {
  x: number;
  y: number;

  terrain: TerrainType;

  decoration: DecorationType;
}
