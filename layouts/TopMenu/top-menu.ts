import { type Router, type RouteLocationNormalizedLoaded } from "vue-router";
import { type Menu } from "../../store/enigma/menus/top-menu";

interface Route extends RouteLocationNormalizedLoaded {
  forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
  active?: boolean;             // New property specific to FormattedMenu
  activeDropdown?: boolean;     // New property specific to FormattedMenu
  subMenu?: FormattedMenu[];  
  pageName:any
 // Override subMenu to use FormattedMenu[] instead of Menu[]
  // No need to redefine icon or title as they inherit from Menu
  // Remove the pageName method as it conflicts with the Menu interface's pageName property
}
// export interface FormattedMenu extends Menu {
//   [x: string]: string | undefined;
//   pageName(pageName: any): string | undefined;
//   icon: any;
//   title: any;
//   active?: boolean;
//   activeDropdown?: boolean;
//   subMenu?: FormattedMenu[];
// }

// Setup top menu
const findActiveMenu = (subMenu: Menu[], route: Route): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((route.forceActiveMenu !== undefined &&
        item.pageName === route.forceActiveMenu) ||
        (route.forceActiveMenu === undefined &&
          (item.pageName === getfullPath(route) || item.pageName === route.name))) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route);
    }
  });
  return match;
};
const getfullPath = (route: Route)=>{
  let fullPath = route.fullPath
  if(route.params.id != null)
  {
    const pathArray:any = fullPath.split("/"+route.params.id.toString())
    fullPath = pathArray[0]
  }
  const pathParems:any =fullPath.split("?")
  fullPath = pathParems[0]
  fullPath = fullPath.replace("/create",'')
  return fullPath;
}

const nestedMenu = (menu: Array<Menu>, route: Route) => {
  const formattedMenu: Array<FormattedMenu> = [];
  menu.forEach((item) => {
    if (typeof item !== "string") {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pageName: item.pageName,
        subMenu: item.subMenu,
        ignore: item.ignore,
      };
      menuItem.active =
        ((route.forceActiveMenu !== undefined &&
          menuItem.pageName === route.forceActiveMenu) ||
          (route.forceActiveMenu === undefined &&
            (menuItem.pageName === getfullPath(route) || menuItem.pageName === route.name)) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, route))) &&
        !menuItem.ignore;

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route);

        // Nested menu
        const subMenu: Array<FormattedMenu> = [];
        nestedMenu(menuItem.subMenu, route).map(
          (menu) => typeof menu !== "string" && subMenu.push(menu)
        );
        menuItem.subMenu = subMenu;
      }

      formattedMenu.push(menuItem);
    } else {
      formattedMenu.push(item);
    }
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, router: Router) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pageName !== undefined) {
      router.push(menu.pageName)
      // router.push({
        // name: menu.pageName,
      // });
    }
  }
};

export { nestedMenu, linkTo };
