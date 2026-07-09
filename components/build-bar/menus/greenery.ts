import { FaTree } from "react-icons/fa";
import type { BuildMenuConfig } from "../types";

export const greeneryMenu: BuildMenuConfig = {
  id: "greenery",
  title: "Greenery",
  rootLabel: "Greenery",
  rootAriaLabel: "Open greenery menu",
  rootIcon: FaTree,
  items: [
    {
      kind: "soon",
    },
  ],
};
