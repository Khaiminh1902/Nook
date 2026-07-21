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
      kind: "soon",
    },
  ],
};
