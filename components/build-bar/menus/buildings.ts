import Cabin from "@/public/assets/buildings/cabin.png";
import House from "@/public/assets/buildings/house.png";
import { FaHouse } from "react-icons/fa6";
import type { BuildMenuConfig } from "../types";

export const buildingsMenu: BuildMenuConfig = {
  id: "buildings",
  title: "Buildings",
  rootLabel: "Buildings",
  rootAriaLabel: "Open buildings menu",
  rootIcon: FaHouse,
  items: [
    {
      kind: "placeBuilding",
      label: "Cabin",
      ariaLabel: "Build cabin",
      buildingType: "cabin",
      imageSrc: Cabin,
      imageWidth: 50,
      imageHeight: 50,
      labelClassName: "mt-1",
    },
    {
      kind: "placeBuilding",
      label: "House",
      ariaLabel: "Build house",
      buildingType: "house",
      imageSrc: House,
      imageWidth: 60,
      imageHeight: 60,
      labelClassName: "mt-1",
    },
    {
      kind: "soon",
    },
  ],
};
