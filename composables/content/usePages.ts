export const usePages = () => {
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
    const pageList: any = await useAsyncData("pages", () =>
      $larafetch(`/page?${paramString}`)
    );

    const pages = computed(() => pageList.data.value.data);
    const lastPage = computed(() => pageList.data.value.last_page);

    return {
      pages,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deletePage() {
    try {
      await $larafetch(`/page/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Page successfully deleted`,
        "success"
      );
      const { pages } = await list();
      if (pages.value.length == 0) {
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
  async function updatePage(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/page/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Page Updated successfully`,
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
  async function addPage(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/page`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd("Added Successfully", `Page Added successfully`, "success");
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
  async function getPage(id: number) {
    const result: any = await useAsyncData("page", () =>
      $larafetch(`/page/${id}`)
    );
    return result.data;
  }
  async function updateMeta(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/page/${id}/meta-data`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Meta Data Updated successfully`,
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
    await useAsyncData("pageStatusChange", () =>
      $larafetch(`/page/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Page Status Change`, "success");
    await list();
  }

  async function updateTranslatedPage(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/page/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Page Updated successfully`,
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
      $larafetch(`/page/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function updateTranslatedMeta(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/page/${id}/meta-translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Meta Data Updated successfully`,
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

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    list,
    getPage,
    updatePage,
    addPage,
    deletePage,
    statusChange,
    updateMeta,
    updateTranslatedPage,
    getTranslatedPage,
    updateTranslatedMeta,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
