export const useCustomers = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = ref(typeof route.query.keyword == "string" ? route.query.keyword : "");
  const first_name = ref(typeof route.query.first_name == "string" ? route.query.first_name : "");
  const last_name = ref(typeof route.query.last_name == "string" ? route.query.last_name : "");
  const city = ref(typeof route.query.city == "string" ? route.query.city : "");
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const status_id = ref(
    typeof route.query.status_id == "string" ? parseInt(route.query.status_id) : 0
  );
  const type_id = ref(
    typeof route.query.type_id == "string" ? parseInt(route.query.type_id) : 0
  );
  const country_id = ref(
    typeof route.query.country_id == "string" ? parseInt(route.query.country_id) : 0
  );
  const state_id = ref(
    typeof route.query.state_id == "string" ? parseInt(route.query.state_id) : 0
  );
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  async function list() {
    let paramString = `page=${currentPage.value}&per_page=${useRuntimeConfig().public.perPage}`;

    if(keyword.value != "")
    {
      paramString = paramString+"&keyword="+keyword.value
    }
    if(first_name.value != "")
    {
      paramString = paramString+"&first_name="+first_name.value
    }
    if(last_name.value != "")
    {
      paramString = paramString+"&last_name="+last_name.value
    }
    if(city.value != "")
    {
      paramString = paramString+"&city="+city.value
    }
    if (status_id.value > 0) {
      paramString = paramString + `&status_id=${status_id.value}`;
    }
    if (country_id.value > 0) {
      paramString = paramString + `&country_id=${country_id.value}`;
    }
    if (type_id.value > 0) {
      paramString = paramString + `&type_id=${type_id.value}`;
    }
    if (state_id.value > 0) {
      paramString = paramString + `&state_id=${state_id.value}`;
    }

    const accountList: any = await useAsyncData("accountList", () =>
      $larafetch(`/accounts?${paramString}&order_by=${
        orderBy.value
      }&order_type=${
        orderType.value
      }`)
    );

    const accounts = computed(() => accountList.data.value.data);
    const lastPage = computed(() => accountList.data.value.last_page);

    return {
      accounts,
      lastPage,
      currentPage,
      keyword,
      first_name,
      last_name,
      city,
      status_id,
      country_id,
      type_id,
      state_id,
      orderBy,
      orderType
    };
  }
  async function updateAccount(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/accounts/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Account updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Update failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function getCustomer(account_id:number) {
    const account: any = await useAsyncData("getCustomer", () =>
      $larafetch(`/accounts/${account_id}`)
    );
    return account.data;
  }
  async function accountStatuses() {
    const list: any = await useAsyncData(
        'accountStatuses',
        () => $larafetch(`/account-status`),
      )
      return list.data;
  }
  function resetPage() {
    currentPage.value = 1;
  }
  return {
    list,
    accountStatuses,
    updateAccount,
    getCustomer,
    resetPage,
    loading,
    errors
  };
};
