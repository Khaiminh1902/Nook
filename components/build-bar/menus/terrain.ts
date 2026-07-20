import Dirt from "@/public/assets/game/dirt.png";
import Water from "@/public/assets/game/water.png";
import Sand from "@/public/assets/game/sand.png";
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
      ariaLabel: "Place dirt terrain",
      roadSurface: "dirt",
      imageSrc: Dirt,
      imageWidth: 60,
      imageHeight: 60,
      imageClassName: "mt-2",
      labelClassName: "mt-3",
    },
    {
      kind: "placePath",
      label: "Water",
      ariaLabel: "Place water terrain",
      roadSurface: "water",
      imageSrc: Water,
      imageWidth: 60,
      imageHeight: 60,
      imageClassName: "mt-2",
      labelClassName: "mt-3",
    },
    {
      kind: "placePath",
      label: "Sand",
      ariaLabel: "Place sand terrain",
      roadSurface: "sand",
      imageSrc: Sand,
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
