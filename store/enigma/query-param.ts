import { defineStore } from "pinia";

interface QueryParamState {
  queryParamValue: any;
}

export const useQueryParamStore = defineStore("QueryParam", {
  state: (): QueryParamState => ({
    queryParamValue: {},
  }),
  getters: {
    queryParam(state) {
      return state.queryParamValue;
    },
  },
  actions: {
    setQueryParam(queryParam: any) {
      this.queryParamValue = queryParam;
    },
  },
  persist: true,
});
