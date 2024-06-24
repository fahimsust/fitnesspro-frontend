import { Router } from "vue-router";
import { slideUp, slideDown } from "../../../utils/enigma/helper";
import { FormattedMenu } from "../../../layouts/SideMenu/side-menu";

const linkTo = (
  menu: FormattedMenu,
  router: Router,
  setActiveMobileMenu: (active: boolean) => void
) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pageName !== undefined) {
      setActiveMobileMenu(false);

      router.push(menu.pageName)
      // router.push({
      //   name: menu.pageName,
      // });
    }
  }
};

const enter = (el: HTMLElement) => {
  slideDown(el, 300);
};

const leave = (el: HTMLElement) => {
  slideUp(el, 300);
};

export { linkTo, enter, leave };
