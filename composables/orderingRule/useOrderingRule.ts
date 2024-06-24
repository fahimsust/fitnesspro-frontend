export const useOrderingRule = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    const OrderingRuleList: any = await useAsyncData("orderingRules", () =>
      $larafetch(
        `/ordering-rules?page=${currentPage.value}&keyword=${
          keywordString.value
        }&order_by=${
          orderBy.value
        }&order_type=${
          orderType.value
        }&per_page=${useRuntimeConfig().public.perPage}`
      )
    );
    const orderingRules = computed(() => OrderingRuleList.data.value.data);
    const lastPage = computed(() => OrderingRuleList.data.value.last_page);
    return {
      orderingRules,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deleteOrderingRule(id: number) {
    try {
      await $larafetch(`/ordering-rule/${deleteId.value}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Ordering Rule successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    const { orderingRules } = await list();
    if (orderingRules.value.length == 0) {
      if (currentPage.value > 1) {
        createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
        currentPage.value = currentPage.value - 1;
        await list();
      }
    }
  }
  async function updateOrderingRule(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/ordering-rule/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Ordering Rule updated successfully`,
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
  async function createOrderingRule(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/ordering-rule/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Ordering Rule created successfully`,
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
  async function updateTranslatedOrderingRule(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/ordering-rule/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Translation Updated successfully`,
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
  async function statusChange(formData: object, id: number) {
    await useAsyncData("orderingRuleStatus", () =>
      $larafetch(`/ordering-rule/${id}/status`, {
        method: "post",
        body: formData,
      })
    );
    swalTopEnd("Status Change", `Ordering Rule Status Change`, "success");
    await list();
  }
  async function getRule(id: number) {
    const result: any = await useAsyncData("orderingRule", () =>
      $larafetch(`/ordering-rule/${id}`)
    );
    return result.data;
  }
  async function getTranslatedOrderingRule(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedOrderingRule", () =>
      $larafetch(`/ordering-rule/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteOrderingRule,
    createOrderingRule,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    statusChange,
    getRule,
    updateOrderingRule,
    updateTranslatedOrderingRule,
    getTranslatedOrderingRule,
  };
};
