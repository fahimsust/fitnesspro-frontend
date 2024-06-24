import { defineStore } from 'pinia'

export const usePagenavStore = defineStore({
    id: 'pagenav-store',
    state: () => {
      return {
        nav: [],
      }
    },
    actions: {},
    getters: {
      navigation: state => state.nav,
    },
  })