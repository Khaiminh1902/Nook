import { TbFountainFilled } from "react-icons/tb";
import JapanGate from "@/public/assets/artistic/japan-gate.png";
import type { BuildMenuConfig } from "../types";

export const structuresMenu: BuildMenuConfig = {
  id: "structures",
  title: "Artistic",
  rootLabel: "Artistic",
  rootAriaLabel: "Open structures menu",
  rootIcon: TbFountainFilled,
  items: [
    {
      kind: "placeGreenery",
      label: "Gate",
      ariaLabel: "Place gate",
      greeneryType: "gate",
      imageSrc: JapanGate,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
  ],
};
