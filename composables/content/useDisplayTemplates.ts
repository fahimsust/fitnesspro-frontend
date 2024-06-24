export const useDisplayTemplates = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);
  const typeIdRoute = route.query.type_id;
  const typeId = ref(
    typeof typeIdRoute == "string" ? parseInt(typeIdRoute) : 0
  );
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${keywordString.value
      }&order_by=${
        orderBy.value
      }&order_type=${
        orderType.value
      }&per_page=${useRuntimeConfig().public.perPage}`
    if (typeId.value > 0) {
      paramString = paramString + `&type_id=${typeId.value}`;
    }
    const displayTemplateList: any = await useAsyncData("displayTemplateList", () =>
      $larafetch(`/display-template?${paramString}`)
    );
    const displayTemplates = computed(() => displayTemplateList.data.value.data);
    const lastPage = computed(() => displayTemplateList.data.value.last_page);
    return {
      displayTemplates,
      lastPage,
      currentPage,
      keywordString,
      typeId,
      orderBy,
      orderType
    };
  }
  async function deleteDisplayTemplate(id: number) {
    try {
      await $larafetch(`/display-template/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Display Template successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    const { displayTemplates } = await list();
    if (displayTemplates.value.length == 0) {
      if (currentPage.value > 1) {
        createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
        currentPage.value = currentPage.value - 1;
        await list();
      }
    }
  }
  async function updateDisplayTemplate(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/display-template/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Display Template updated successfully`,
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
  async function createDisplayTemplate(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/display-template/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Display Template created successfully`,
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

  async function getDisplayTemplateTypes() {
    const list: any = await useAsyncData("displayTemplateTypes", () => $larafetch(`display-template-type`));
    return list.data;
  }

  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteDisplayTemplate,
    createDisplayTemplate,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateDisplayTemplate,
    getDisplayTemplateTypes
  };
};
