export enum TerrainType {
  Grass = "grass",
}

export interface Tile {
  x: number;
  y: number;

  terrain: TerrainType;
}
