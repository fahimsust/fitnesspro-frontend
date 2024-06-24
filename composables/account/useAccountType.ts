export const useAccountType = () => {
  const route = useRoute();
  const page = route.query.page;
  const keywordRoute = route.query.keyword;
  const keywordString = ref(typeof keywordRoute == "string" ? keywordRoute : "");
  const currentPageType = ref(typeof page == "string" ? parseInt(page) : 1);
  const currentPage = ref(1);
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  async function list(condition_id:number,keyword: string = "",) {
    let paramString = `page=${currentPage.value}&keyword=${
      keyword
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}&condition_id=${condition_id}`;
    const accountTypeList: any = await useAsyncData("accountTypes", () =>
      $larafetch(`/account-types?${paramString}`)
    );

    const accountTypes = computed(() => accountTypeList.data.value.data);
    const lastPage = computed(() => accountTypeList.data.value.last_page);

    return {
      accountTypes,
      lastPage,
      currentPage,
      orderBy,
      orderType
    };
  }

  async function listAccountTypes() {
    let paramString = `page=${currentPageType.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const accountTypeList: any = await useAsyncData("listAccountTypes", () =>
      $larafetch(`/account-types?${paramString}`)
    );

    const accountTypes = computed(() => accountTypeList.data.value.data);
    const lastPage = computed(() => accountTypeList.data.value.last_page);

    return {
      accountTypes,
      lastPage,
      currentPageType,
      keywordString,
      orderBy,
      orderType
    };
  }

  async function updateAccountType(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-type/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Account Type updated successfully`,
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
  async function createAccountType(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/account-type/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Account Type created successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  async function all() {
    const list: any = await useAsyncData(
        'accountTypes',
        () => $larafetch(`/account-type`),
    )
    return list.data;
}
async function messageTemplates() {
  const list: any = await useAsyncData(
      'messageTemplates',
      () => $larafetch(`/message-template`),
  )
  return list.data;
}
async function loyaltyPrograms() {
  const list: any = await useAsyncData(
      'loyaltyPrograms',
      () => $larafetch(`/loyalty-program`),
  )
  return list.data;
}
  return {
    list,
    all,
    updateAccountType,
    createAccountType,
    listAccountTypes,
    messageTemplates,
    loyaltyPrograms,
    errors,
    loading
  };
};
