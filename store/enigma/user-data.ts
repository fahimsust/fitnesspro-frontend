import { defineStore } from "pinia";
import { useStorage, useLocalStorage } from "@vueuse/core"

interface UserData {
  userDataValue:any;
}
export const userStore = defineStore("userData", {
  state: (): UserData => ({
    userDataValue:{}
  }),
  getters: {
    userData(state) {
      if(state.userDataValue == undefined)
      {
        return null;
      }
      return state.userDataValue ;
    },
  },
  actions: {
    setUserValue(userValue: any) {
      this.userDataValue = userValue;
    },
  },
  persist: true,
});