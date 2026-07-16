import { PiWallFill } from "react-icons/pi";
import Fence from "@/public/assets/walls/fence.png";
import type { BuildMenuConfig } from "../types";

export const wallsMenu: BuildMenuConfig = {
  id: "walls",
  title: "Wall",
  rootLabel: "Wall",
  rootAriaLabel: "Open wall menu",
  rootIcon: PiWallFill,
  items: [
    {
      kind: "placeGreenery",
      label: "Fence",
      ariaLabel: "Place fence",
      greeneryType: "fence",
      imageSrc: Fence,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
  ],
};
