import type { BuildMenu, BuildMenuConfig } from "../types";
import { buildingsMenu } from "./buildings";
import { greeneryMenu } from "./greenery";
import { lightsMenu } from "./lights";
import { roadsMenu } from "./roads";
import { structuresMenu } from "./structures";
import { terrainMenu } from "./terrain";

export const buildMenus = [
  buildingsMenu,
  roadsMenu,
  terrainMenu,
  lightsMenu,
  structuresMenu,
  greeneryMenu,
] satisfies BuildMenuConfig[];

export const buildMenuMap: Record<BuildMenu, BuildMenuConfig> = {
  buildings: buildingsMenu,
  roads: roadsMenu,
  terrain: terrainMenu,
  lights: lightsMenu,
  structures: structuresMenu,
  greenery: greeneryMenu,
};
