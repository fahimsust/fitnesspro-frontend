export const useDiscount = () => {
  const route = useRoute();
  const router = useRouter();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const status = route.query.status;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const discountStatus = ref(typeof status == 'string' ? parseInt(status) : "")
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  async function discountList() {
    const discountList: any = await useAsyncData(
      "discounts",
      () =>
        $larafetch(
          `/discount?page=${currentPage.value}&keyword=${keywordString.value
          }&status=${discountStatus.value}&order_by=${
            orderBy.value
          }&order_type=${
            orderType.value
          }&per_page=${useRuntimeConfig().public.perPage}`
        )
    );

    const discounts = computed(() => discountList.data.value.data);
    const lastPage = computed(() => discountList.data.value.last_page);

    return {
      discounts,
      lastPage,
      currentPage,
      keywordString,
      discountStatus,
      orderBy,
      orderType
    };
  }
  async function updateDiscount(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/discount/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Discount details updated successfully`,
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
  }
  async function archive() {
    await useAsyncData("delDiscount", () =>
      $larafetch(`/discount/${archiveId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Discount successfully archived`,
      "success"
    );
    deleteConfirmationModal.value = false;
    const { discounts } = await discountList();
    if (discounts.value.length == 0) {
      if (currentPage.value > 1) {
        currentPage.value = currentPage.value - 1;
        await discountList();
      }
    }
  }
  async function createDiscount(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/discount/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Discount created successfully`,
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
    return result.data;
  }
  async function getDiscount(id: number) {
    const result: any = await useAsyncData("discount", () =>
      $larafetch(`/discount/${id}`)
    );
    return result.data;
  }
  async function statusChange(formData: object, id: number) {
    await useAsyncData("statusChange", () =>
      $larafetch(`/discount/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Discount Status Change`, "success");
    await discountList();
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }
  return {
    discountList,
    updateDiscount,
    createDiscount,
    archive,
    statusChange,
    setArchiveId,
    getDiscount,
    errors,
    loading,
    deleteConfirmationModal
  };
};
