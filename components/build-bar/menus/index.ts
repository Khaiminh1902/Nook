import type { BuildMenu, BuildMenuConfig } from "../types";
import { buildingsMenu } from "./buildings";
import { greeneryMenu } from "./greenery";
import { lightsMenu } from "./lights";
import { roadsMenu } from "./roads";
import { structuresMenu } from "./structures";
import { terrainMenu } from "./terrain";
import { wallsMenu } from "./walls";

export const buildMenus = [
  terrainMenu,
  buildingsMenu,
  roadsMenu,
  wallsMenu,
  lightsMenu,
  structuresMenu,
  greeneryMenu,
] satisfies BuildMenuConfig[];

export const buildMenuMap: Record<BuildMenu, BuildMenuConfig> = {
  buildings: buildingsMenu,
  roads: roadsMenu,
  terrain: terrainMenu,
  walls: wallsMenu,
  lights: lightsMenu,
  structures: structuresMenu,
  greenery: greeneryMenu,
};
