import { PiWallFill } from "react-icons/pi";
import type { BuildMenuConfig } from "../types";

export const wallsMenu: BuildMenuConfig = {
  id: "walls",
  title: "Wall",
  rootLabel: "Wall",
  rootAriaLabel: "Open wall menu",
  rootIcon: PiWallFill,
  items: [
    {
      kind: "soon",
    },
  ],
};
