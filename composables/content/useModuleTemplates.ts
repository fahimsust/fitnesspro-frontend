export const useModuleTemplates = () => {
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
  const templateIdRoute = route.query.parent_template_id;
  const templateId = ref(
    typeof templateIdRoute == "string" ? parseInt(templateIdRoute) : 0
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
    if (templateId.value > 0) {
      paramString = paramString + `&parent_template_id=${templateId.value}`;
    }
    const moduleTemplateList: any = await useAsyncData("moduleTemplateList", () =>
      $larafetch(`/module-templates?${paramString}`)
    );
    const moduleTemplates = computed(() => moduleTemplateList.data.value.data);
    const lastPage = computed(() => moduleTemplateList.data.value.last_page);
    return {
      moduleTemplates,
      lastPage,
      currentPage,
      keywordString,
      templateId,
      orderBy,
      orderType
    };
  }
  async function getModuleTemplate(id: number) {
    const list: any = await useAsyncData("getModuleTemplate", () =>
      $larafetch(`module-template/${id}`)
    );
    return list.data;
  }
  async function deleteModuleTemplate(id: number) {
    try {
      await $larafetch(`/module-template/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Module Template successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    const { moduleTemplates } = await list();
    if (moduleTemplates.value.length == 0) {
      if (currentPage.value > 1) {
        createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
        currentPage.value = currentPage.value - 1;
        await list();
      }
    }
  }
  async function updateModuleTemplate(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/module-template/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Module Template updated successfully`,
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
  async function createModuleTemplate(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/module-template/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Module Template created successfully`,
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

  async function getLayoutSections() {
    const list: any = await useAsyncData("layoutSections", () => $larafetch(`layout-section`));
    return list.data;
  }
  async function geModule() {
    const list: any = await useAsyncData("modules", () => $larafetch(`module`));
    return list.data;
  }

  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteModuleTemplate,
    createModuleTemplate,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateModuleTemplate,
    getModuleTemplate,
    getLayoutSections,
    geModule
  };
};
