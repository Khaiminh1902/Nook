import DirtRoad from "@/public/assets/game/dirt.png";
import { FaLayerGroup } from "react-icons/fa";
import type { BuildMenuConfig } from "../types";

export const terrainMenu: BuildMenuConfig = {
  id: "terrain",
  title: "Terrain",
  rootLabel: "Terrain",
  rootAriaLabel: "Open terrain menu",
  rootIcon: FaLayerGroup,
  items: [
    {
      kind: "placePath",
      label: "Dirt",
      ariaLabel: "Build dirt terrain",
      roadSurface: "dirt",
      imageSrc: DirtRoad,
      imageWidth: 60,
      imageHeight: 60,
      imageClassName: "mt-2",
      labelClassName: "mt-3",
    },
    {
      kind: "placePath",
      label: "Water",
      ariaLabel: "Build water terrain",
      roadSurface: "water",
      imageSrc: DirtRoad,
      imageWidth: 60,
      imageHeight: 60,
      imageClassName: "mt-2",
      labelClassName: "mt-3",
    },
    {
      kind: "soon",
    },
  ],
};
