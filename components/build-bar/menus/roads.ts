import ConcreteRoad from "@/public/assets/road/concrete.png";
import { FaRoad } from "react-icons/fa";
import type { BuildMenuConfig } from "../types";

export const roadsMenu: BuildMenuConfig = {
  id: "roads",
  title: "Roads",
  rootLabel: "Roads",
  rootAriaLabel: "Open roads menu",
  rootIcon: FaRoad,
  items: [
    {
      kind: "placePath",
      label: "Concrete",
      ariaLabel: "Build concrete road",
      roadSurface: "concrete",
      imageSrc: ConcreteRoad,
      imageWidth: 70,
      imageHeight: 70,
    },
    {
      kind: "soon",
    },
  ],
};
