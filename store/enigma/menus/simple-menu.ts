import { defineStore } from "pinia";
import * as lucideIcons from "lucide-vue-next";
import { menu } from "../../../assets/menu.js"

export type Icon = keyof typeof lucideIcons;
export interface Menu {
  icon: Icon|String;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SimpleMenuState {
  menu: Array<Menu | "devider">;
}

export const useSimpleMenuStore = defineStore("simpleMenu", {
  state: (): SimpleMenuState => ({
    menu: menu
  }),
});
