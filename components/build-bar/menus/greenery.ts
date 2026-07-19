import { FaTree } from "react-icons/fa";
import Oak from "@/public/assets/greenery/1.png";
import Ash from "@/public/assets/greenery/2.png";
import Maple from "@/public/assets/greenery/3.png";
import Willow from "@/public/assets/greenery/4.png";
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
      label: "Ash",
      ariaLabel: "Plant ash tree",
      greeneryType: "oak",
      imageSrc: Oak,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
    {
      kind: "placeGreenery",
      label: "Oak",
      ariaLabel: "Plant oak tree",
      greeneryType: "ash",
      imageSrc: Ash,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
    {
      kind: "placeGreenery",
      label: "Maple",
      ariaLabel: "Plant maple tree",
      greeneryType: "maple",
      imageSrc: Maple,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
    {
      kind: "placeGreenery",
      label: "Willow",
      ariaLabel: "Plant willow tree",
      greeneryType: "willow",
      imageSrc: Willow,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
  ],
};
