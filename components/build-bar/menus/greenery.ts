import { FaTree } from "react-icons/fa";
import Tree1 from "@/public/assets/game/tree1.png";
import type { BuildMenuConfig } from "../types";

export const greeneryMenu: BuildMenuConfig = {
  id: "greenery",
  title: "Greenery",
  rootLabel: "Greenery",
  rootAriaLabel: "Open greenery menu",
  rootIcon: FaTree,
  items: [
    {
      kind: "placeGreenery",
      label: "Tree",
      ariaLabel: "Plant tree",
      greeneryType: "tree",
      imageSrc: Tree1,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
    {
      kind: "soon",
    },
  ],
};
