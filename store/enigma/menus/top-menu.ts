import { defineStore } from "pinia";

import * as lucideIcons from "lucide-vue-next";

export type Icon = keyof typeof lucideIcons;

export interface Menu {
  icon: Icon | String;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface TopMenuState {
  menu: Array<Menu>;
}

export const useTopMenuStore = defineStore("topMenu", {
  state: (): TopMenuState => ({
    menu: [
      {
        icon: "Bus",
        pageName: "book",
        title: "Book a Trip",
      },
      {
        icon: "ConciergeBell",
        pageName: "concierge",
        title: "Concierge",
        subMenu: [
          {
            icon: "CloudMoon",
            pageName: "concierge/premium",
            title: "Why Go Premium",
            ignore: true,
          },
          {
            icon: "FileQuestion",
            pageName: "concierge/faqs",
            title: "Faqs",
            ignore: true,
          },
          {
            icon: "Building",
            pageName: "concierge/terms",
            title: "Terms & Conditions",
            ignore: true,
          },
        ],
      },
      {
        icon: "ShoppingBag",
        pageName: "shop",
        title: "Pro Shop",
        subMenu: [
          {
            icon: "DollarSign",
            pageName: "shop/fees",
            title: "Additional Fee",
          },
          {
            icon: "HeartPulse",
            pageName: "shop/fitness",
            title: "Fitness Education",
          },
          {
            icon: "Gift",
            pageName: "shop/gift",
            title: "Gifting Options",
          },
          {
            icon: "Music",
            pageName: "shop/music",
            title: "Music Downloads",
          },
          {
            icon: "Leaf",
            pageName: "shop/nutrition",
            title: "Nutrition Supplements",
          },
          {
            icon: "Apple",
            pageName: "shop/apparel",
            title: "Teaching Apparel",
          },
          {
            icon: "BaggageClaim",
            pageName: "shop/lounges",
            title: "Transfers and Lounges",
          },

        ],
      },
      {
        icon: "CalendarPlus",
        pageName: "events",
        title: "FitPro Events",
      },
      {
        icon: "Users",
        pageName: "community",
        title: "Community",
      },
    ],
  }),
});
