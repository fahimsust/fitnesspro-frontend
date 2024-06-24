export const useCustomForms = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const formList: any = await useAsyncData("customForms", () =>
      $larafetch(`/custom-forms?${paramString}`)
    );

    const customForms = computed(() => formList.data.value.data);
    const lastPage = computed(() => formList.data.value.last_page);

    return {
      customForms,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deleteCustomForm() {
    try {
      await $larafetch(`/custom-form/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Custom Form successfully deleted`,
        "success"
      );
      const { customForms } = await list();
      if (customForms.value.length == 0) {
        if (currentPage.value > 1) {
          createNewPathAndPush(
            "page",
            (currentPage.value - 1).toString(),
            true
          );
          currentPage.value = currentPage.value - 1;
          await list();
        }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateCustomForm(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-form/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Custom Form Updated successfully`,
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

  async function addCustomForm(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-form`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Custom Form Added successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Add failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  
  async function getCustomForm(id: number) {
    const result: any = await useAsyncData("customForm", () =>
      $larafetch(`/custom-form/${id}`)
    );
    return result.data;
  }

  async function updateTranslatedForm(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-form/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Custom Form Updated successfully`,
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

  async function getTranslatedForm(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedForm", () =>
      $larafetch(`/custom-form/${id}/translation/${language_id}`)
    );
    return result.data;
  }

  async function customForms() {
    const list: any = await useAsyncData("customForms", () =>
      $larafetch(`custom-form-list`)
    );
    return list.data;
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    list,
    getCustomForm,
    updateCustomForm,
    addCustomForm,
    deleteCustomForm,
    updateTranslatedForm,
    getTranslatedForm,
    customForms,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
