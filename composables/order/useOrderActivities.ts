export const useOrderActivities = () => {
  const currentPage = ref(1);
  async function getOrderActives(order_id:number) {
    let paramString = `page=${currentPage.value
      }&per_page=${useRuntimeConfig().public.perPage
      }`;
    const activityList: any = await useAsyncData("searchOrderAccount", () =>
      $larafetch(`/order/${order_id}/activity/?${paramString}`)
    );

    const activities = computed(() => activityList.data.value.data);
    const lastPage = computed(() => activityList.data.value.last_page);

    return {
      activities,
      lastPage,
      currentPage,
    };
  }
  

  return {
    getOrderActives,
  };
};
