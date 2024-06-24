export const useOrderReferrals = () => {
  const currentPage = ref(1);
  async function searchAffiliates(
    order_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&order_id=${order_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const affiliateList: any = await useAsyncData("productAccessory", () =>
      $larafetch(`/affiliate?${paramString}`)
    );

    const affiliates = computed(() => affiliateList.data.value.data);
    const lastPage = computed(() => affiliateList.data.value.last_page);

    return {
      affiliates,
      lastPage,
      currentPage,
    };
  }

  return {
    searchAffiliates,
  };
};
