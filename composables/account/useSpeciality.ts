export const useSpeciality = () => {
  const currentPage = ref(1);
  async function list(condition_id:number,keyword:string = "") {
    let paramString = `page=${currentPage.value}&keyword=${
      keyword
    }&per_page=${useRuntimeConfig().public.perPage}&condition_id=${condition_id}`;
    const specilityList: any = await useAsyncData("specialities", () =>
      $larafetch(`/specialities?${paramString}`)
    );

    const specilities = computed(() => specilityList.data.value.data);
    const lastPage = computed(() => specilityList.data.value.last_page);

    return {
      specilities,
      lastPage,
      currentPage,
    };
  }
  async function specialities() {
 
    const specialities: any = await useAsyncData("Allspecialities", () =>
      $larafetch(`/specialities/all`)
    );
    return specialities.data;
  }
  return {
    list,
    specialities
  };
};
