export const useAbandonedOrder = () => {
  const route = useRoute();
  const page = route.query.page;
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const keyword = ref(typeof route.query.keyword == "string" ? route.query.keyword : "");
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    let paramString = `page=${currentPage.value}&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    if(keyword.value != "")
    {
      paramString = paramString+"&keyword="+keyword.value
    }
    const orderList: any = await useAsyncData("abandonedOrderList", () =>
      $larafetch(`/abandoned-orders?${paramString}`)
    );
    
    const abandonedOrders = computed(() => orderList.data.value.data);
    const lastPage = computed(() => orderList.data.value.last_page);

    return {
      abandonedOrders,
      lastPage,
      currentPage,
      keyword,
      orderBy,
      orderType
    };
  }
  async function getAbandonedOrder(order_id:number) {
    const account: any = await useAsyncData("getCustomer", () =>
      $larafetch(`/abandoned-orders/${order_id}`)
    );
    return account.data;
  }
  return {
    list,
    getAbandonedOrder
  };
};
