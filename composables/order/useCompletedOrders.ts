export const useCompletedOrders = () => {
  const route = useRoute();
  const page = route.query.page;
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "id");
  const orderType = ref(typeof order_type == "string" ? order_type : "asc");
  const keyword = ref(typeof route.query.keyword == "string" ? route.query.keyword : "");
  const order_no = ref(typeof route.query.order_no == "string" ? route.query.order_no : "");
  const start_date = ref(typeof route.query.start_date == "string" ? route.query.start_date : "");
  const end_date = ref(typeof route.query.end_date == "string" ? route.query.end_date : "");
  const start_date_travel = ref(typeof route.query.start_date_travel == "string" ? route.query.start_date_travel : "");
  const end_date_travel = ref(typeof route.query.end_date_travel == "string" ? route.query.end_date_travel : "");
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const distributor_id = ref(
    typeof route.query.distributor_id == "string" ? parseInt(route.query.distributor_id) : 0
  );
  const product_type_id = ref(
    typeof route.query.product_type_id == "string" ? parseInt(route.query.product_type_id) : 0
  );
  const payment_method_id = ref(
    typeof route.query.payment_method_id == "string" ? parseInt(route.query.payment_method_id) : 0
  );
  const shipping_method_id = ref(
    typeof route.query.shipping_method_id == "string" ? parseInt(route.query.shipping_method_id) : 0
  );
  const state_id = ref(
    typeof route.query.state_id == "string" ? parseInt(route.query.state_id) : 0
  );
  const status_id = ref(
    typeof route.query.status_id == "string" ? parseInt(route.query.status_id) : 0
  );
  const country_id = ref(
    typeof route.query.country_id == "string" ? parseInt(route.query.country_id) : 0
  );
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const formatDateForMySQL = (date: string | null): string | null => {
    if (!date) return "";
  
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };
  
  async function list() {
    let paramString = `page=${currentPage.value}&per_page=${useRuntimeConfig().public.perPage}&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }`;

    if(keyword.value != "")
    {
      paramString = paramString+"&keyword="+keyword.value
    }
    if(order_no.value != "")
    {
      paramString = paramString+"&order_no="+order_no.value
    }
    if(start_date.value != "")
    {
      paramString = paramString+"&start_date="+formatDateForMySQL(start_date.value)
    }
    if(end_date.value != "")
    {
      paramString = paramString+"&end_date="+formatDateForMySQL(end_date.value)
    }
    if(start_date_travel.value != "")
    {
      paramString = paramString+"&start_date_travel="+formatDateForMySQL(start_date_travel.value)
    }
    if(end_date_travel.value != "")
    {
      paramString = paramString+"&end_date_travel="+formatDateForMySQL(end_date_travel.value)
    }
    if (status_id.value > 0) {
      paramString = paramString + `&status_id=${status_id.value}`;
    }
    if (country_id.value > 0) {
      paramString = paramString + `&country_id=${country_id.value}`;
    }
    if (distributor_id.value > 0) {
      paramString = paramString + `&type_id=${distributor_id.value}`;
    }
    if (state_id.value > 0) {
      paramString = paramString + `&state_id=${state_id.value}`;
    }
    if (payment_method_id.value > 0) {
      paramString = paramString + `&payment_method_id=${payment_method_id.value}`;
    }
    if (payment_method_id.value > 0) {
      paramString = paramString + `&payment_method_id=${payment_method_id.value}`;
    }
    if (product_type_id.value > 0) {
      paramString = paramString + `&product_type_id=${product_type_id.value}`;
    }

    const orderList: any = await useAsyncData("completeOrders", () =>
      $larafetch(`/orders?${paramString}`)
    );

    const orders = computed(() => orderList.data.value.data);
    const lastPage = computed(() => orderList.data.value.last_page);

    return {
      orders,
      lastPage,
      currentPage,
      keyword,
      order_no,
      start_date,
      end_date,
      start_date_travel,
      end_date_travel,
      status_id,
      country_id,
      distributor_id,
      state_id,
      payment_method_id,
      shipping_method_id,
      product_type_id,
      orderBy,
      orderType
    };
  }
  async function updateOrder(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/orders/${id}`, { method: "put", body: formData }), 
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Order additional fees/additional discount updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Update failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
  }
 
  async function getOrder(order_id:number) {
    const account: any = await useAsyncData("getOrder", () =>
      $larafetch(`/orders/${order_id}`)
    );
    return account.data;
  }
  async function orderStatuses() {
    const list: any = await useAsyncData(
        'orderStatuses',
        () => $larafetch(`/order-status`),
      )
      return list.data;
  }
  async function shipmentStatuses() {
    const list: any = await useAsyncData(
        'shipmentStatuses',
        () => $larafetch(`/shipment-status`),
      )
      return list.data;
  }
  function resetPage() {
    currentPage.value = 1;
  }
  
  return {
    list,
    updateOrder,
    orderStatuses,
    shipmentStatuses,
    getOrder,
    resetPage,
    loading,
    errors
  };
};
