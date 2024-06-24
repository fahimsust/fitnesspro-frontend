export const useFaqs = () => {
  const route = useRoute();
  const page = route.query.page;
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const deleteConfirmationModal = ref(false);
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const orderBy = ref(typeof order_by == "string" ? order_by : "id");
  const orderType = ref(typeof order_type == "string" ? order_type : "desc");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  

  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const faqList: any = await useAsyncData("faqs", () =>
      $larafetch(`/faq?${paramString}`)
    );

    const faqs = computed(() => faqList.data.value.data);
    const lastPage = computed(() => faqList.data.value.last_page);

    return {
      faqs,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deleteFaq() {
    try {
      await $larafetch(`/faq/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Faq successfully deleted`,
        "success"
      );
      const { faqs } = await list();
      if (faqs.value.length == 0) {
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
  async function updateFaq(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Faq Updated successfully`,
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
  async function updateTranslatedFaq(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Faq Updated successfully`,
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
  async function getTranslatedFaq(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedFaq", () =>
      $larafetch(`/faq/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function addFaq(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/faq`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Faq Added successfully`,
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
  async function getFaq(id: number) {
    const result: any = await useAsyncData("faq", () =>
      $larafetch(`/faq/${id}`)
    );
    return result.data;
  }

  async function statusChange(formData: object, id: number) {
    await useAsyncData("faqStatusChange", () =>
      $larafetch(`/faq/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Faq Status Change`, "success");
    await list();
  }

  async function searchFaqCategory(faq_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&faq_id=${faq_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const categoryList: any = await useAsyncData("faqCategories", () =>
      $larafetch(`/faq-category?${paramString}`)
    );

    const categories = computed(() => categoryList.data.value.data);
    const lastPage = computed(() => categoryList.data.value.last_page);

    return {
      categories,
      lastPage,
      currentPage,
    };
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    searchFaqCategory,
    list,
    getFaq,
    updateFaq,
    addFaq,
    deleteFaq,
    statusChange,
    updateTranslatedFaq,
    getTranslatedFaq,
    errors,
    loading,
    deleteConfirmationModal
  };
};
