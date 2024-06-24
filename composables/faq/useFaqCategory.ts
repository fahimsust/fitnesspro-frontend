export const useFaqCategory = () => {
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

  async function getfaqCategory() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const faqCategoiresList: any = await useAsyncData("faqCategories", () =>
      $larafetch(`/faq-category?${paramString}`)
    );

    const faqCategoires = computed(() => faqCategoiresList.data.value.data);
    const lastPage = computed(() => faqCategoiresList.data.value.last_page);

    return {
      faqCategoires,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function getFaqCategoryList() {
    const list: any = await useAsyncData("faqsCategoryList", () =>
      $larafetch(`faq-category-list`)
    );
    return list.data;
  }
  async function deleteFaqCategory() {
    try {
      await $larafetch(`/faq-category/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Faq Category successfully deleted`,
        "success"
      );
      const { faqCategoires } = await getfaqCategory();
      if (faqCategoires.value.length == 0) {
        if (currentPage.value > 1) {
          createNewPathAndPush(
            "page",
            (currentPage.value - 1).toString(),
            true
          );
          currentPage.value = currentPage.value - 1;
          await getfaqCategory();
        }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateFaqCategory(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq-category/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Faq Category Updated successfully`,
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
  async function updateTranslatedFaqCategory(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq-category/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Faq Category Updated successfully`,
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
  async function getTranslatedFaqCategory(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedFaqCategory", () =>
      $larafetch(`/faq-category/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function addFaqCategory(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq-category`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Faq Category Added successfully`,
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
  async function getFaqCategory(id: number) {
    const result: any = await useAsyncData("faqCategory", () =>
      $larafetch(`/faq-category/${id}`)
    );
    return result.data;
  }

  async function statusChange(formData: object, id: number) {
    await useAsyncData("faqStatusChange", () =>
      $larafetch(`/faq-category/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Faq Category Status Change`, "success");
    await getfaqCategory();
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getfaqCategory,
    getFaqCategory,
    updateFaqCategory,
    addFaqCategory,
    deleteFaqCategory,
    statusChange,
    updateTranslatedFaqCategory,
    getTranslatedFaqCategory,
    getFaqCategoryList,
    errors,
    loading,
    deleteConfirmationModal
  };
};
