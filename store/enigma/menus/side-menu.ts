import { defineStore } from "pinia";
import { menu } from "../../../assets/menu"

import * as lucideIcons from "lucide-vue-next";

export type Icon = keyof typeof lucideIcons;
export interface Menu {
  icon: Icon|String;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "devider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: menu
  }),
});
