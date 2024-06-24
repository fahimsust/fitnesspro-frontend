export const useElements = () => {
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
    const elementList: any = await useAsyncData("elements", () =>
      $larafetch(`/element?${paramString}`)
    );

    const elements = computed(() => elementList.data.value.data);
    const lastPage = computed(() => elementList.data.value.last_page);

    return {
      elements,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deleteElement() {
    try {
      await $larafetch(`/element/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Element successfully deleted`,
        "success"
      );
      const { elements } = await list();
      if (elements.value.length == 0) {
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
  async function updateElement(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/element/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Element Updated successfully`,
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
  async function updateTranslatedPage(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/element/${id}/translation/${language_id}`, {
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
  async function getTranslatedPage(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedPage", () =>
      $larafetch(`/element/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function addElement(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/element`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Element Added successfully`,
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
  async function getElement(id: number) {
    const result: any = await useAsyncData("elements", () =>
      $larafetch(`/element/${id}`)
    );
    return result.data;
  }

  async function statusChange(formData: object, id: number) {
    await useAsyncData("elementStatusChange", () =>
      $larafetch(`/element/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Element Status Change`, "success");
    await list();
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    list,
    getElement,
    updateElement,
    addElement,
    deleteElement,
    statusChange,
    updateTranslatedPage,
    getTranslatedPage,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
