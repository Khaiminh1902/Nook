import { FaLightbulb } from "react-icons/fa";
import type { BuildMenuConfig } from "../types";

export const lightsMenu: BuildMenuConfig = {
  id: "lights",
  title: "Lights",
  rootLabel: "Lights",
  rootAriaLabel: "Open lights menu",
  rootIcon: FaLightbulb,
  items: [
    {
      kind: "soon",
    },
  ],
};
