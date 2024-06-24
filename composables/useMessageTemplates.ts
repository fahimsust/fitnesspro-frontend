export const useMessageTemplates = () => {
  const route = useRoute();
  const router = useRouter();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);
  const categoryIdRoute = route.query.category_id;
  const categoryId = ref(
    typeof categoryIdRoute == "string" ? parseInt(categoryIdRoute) : 0
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
    if (categoryId.value > 0) {
      paramString = paramString + `&category_id=${categoryId.value}`;
    }
    const messageTemplateList: any = await useAsyncData("messageTemplateList", () =>
      $larafetch(`/message-templates?${paramString}`)
    );
    const messageTemplates = computed(() => messageTemplateList.data.value.data);
    const lastPage = computed(() => messageTemplateList.data.value.last_page);
    return {
      messageTemplates,
      lastPage,
      currentPage,
      keywordString,
      categoryId,
      orderBy,
      orderType
    };
  }
  async function getMessageTemplate(id: number, account_id: number = 0, site_id: number = 0, order_id: number = 0, affiliate_id: number = 0) {
    const list: any = await useAsyncData("getMessageTemplate", () =>
      $larafetch(`message-template/${id}?account_id=${account_id}&site_id=${site_id}&order_id=${order_id}&affiliate_id=${affiliate_id}`)
    );
    return list.data;
  }
  async function deleteMessageTemplate(id: number) {
    try {
      await $larafetch(`/message-template/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Message Template successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    const { messageTemplates } = await list();
    if (messageTemplates.value.length == 0) {
      if (currentPage.value > 1) {
        createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
        currentPage.value = currentPage.value - 1;
        await list();
      }
    }
  }
  async function updateMessageTemplate(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/message-template/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Message Template updated successfully`,
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
  async function createMessageTemplate(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/message-template/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Message Template created successfully`,
          "success"
        );
        router.push({ path: "/content/message-templates/" + result.id });
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

  async function updateTranslatedMessageTemplate(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/message-template/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Message Template Updated successfully`,
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

  async function getTranslatedMessageTemplate(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedMessageTemplate", () =>
      $larafetch(`/message-template/${id}/translation/${language_id}`)
    );
    return result.data;
  }

  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteMessageTemplate,
    createMessageTemplate,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateMessageTemplate,
    getMessageTemplate,
    updateTranslatedMessageTemplate,
    getTranslatedMessageTemplate
  };
};
