import { FaLightbulb } from "react-icons/fa";
import StreetLamp from "@/public/assets/light/streelamp.png";
import type { BuildMenuConfig } from "../types";

export const lightsMenu: BuildMenuConfig = {
  id: "lights",
  title: "Lights",
  rootLabel: "Lights",
  rootAriaLabel: "Open lights menu",
  rootIcon: FaLightbulb,
  items: [
    {
      kind: "placeGreenery",
      label: "Lamp Post",
      ariaLabel: "Place lamp post",
      greeneryType: "lamppost",
      imageSrc: StreetLamp,
      imageWidth: 80,
      imageHeight: 80,
      labelClassName: "mt-1",
    },
  ],
};
