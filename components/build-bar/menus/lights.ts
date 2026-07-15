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
      label: "Street Lamp",
      ariaLabel: "Place street lamp",
      greeneryType: "streetLamp",
      imageSrc: StreetLamp,
      imageWidth: 32,
      imageHeight: 72,
      labelClassName: "mt-1",
    },
  ],
};
