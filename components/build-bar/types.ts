import type { IconType } from "react-icons";
import type { StaticImageData } from "next/image";
import type { BuildingType, GreeneryType, RoadSurface } from "@/store/gameStore";

export type BuildMenu =
  | "buildings"
  | "roads"
  | "terrain"
  | "walls"
  | "lights"
  | "structures"
  | "greenery";

export type BuildMenuItem =
  | {
      kind: "placeBuilding";
      label: string;
      ariaLabel: string;
      buildingType: Exclude<BuildingType, "path">;
      imageSrc: StaticImageData;
      imageWidth: number;
      imageHeight: number;
      imageClassName?: string;
      labelClassName?: string;
    }
  | {
      kind: "placePath";
      label: string;
      ariaLabel: string;
      roadSurface: RoadSurface;
      imageSrc: StaticImageData;
      imageWidth: number;
      imageHeight: number;
      imageClassName?: string;
      labelClassName?: string;
    }
  | {
      kind: "placeGreenery";
      label: string;
      ariaLabel: string;
      greeneryType: GreeneryType;
      imageSrc: StaticImageData;
      imageWidth: number;
      imageHeight: number;
      imageClassName?: string;
      labelClassName?: string;
    }
  | {
      kind: "soon";
      label?: string;
    };

export interface BuildMenuConfig {
  id: BuildMenu;
  title: string;
  rootLabel: string;
  rootAriaLabel: string;
  rootIcon: IconType;
  rootLabelClassName?: string;
  items: BuildMenuItem[];
}
