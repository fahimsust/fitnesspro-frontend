export const useBrands = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    const brandList: any = await useAsyncData("brandLists", () =>
      $larafetch(
        `/brands?page=${currentPage.value}&keyword=${
          keywordString.value
        }&order_by=${
          orderBy.value
        }&order_type=${
          orderType.value
        }&per_page=${useRuntimeConfig().public.perPage}`
      )
    );
    const brands = computed(() => brandList.data.value.data);
    const lastPage = computed(() => brandList.data.value.last_page);
    return {
      brands,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function deleteBrand(id: number) {
    try {
      await $larafetch(`/brand/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Brand successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    const { brands } = await list();
    if (brands.value.length == 0) {
      if (currentPage.value > 1) {
        createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
        currentPage.value = currentPage.value - 1;
        await list();
      }
    }
  }
  async function updateBrand(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/brand/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Brand updated successfully`,
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
  async function createBrand(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/brand/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Brand created successfully`,
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
  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteBrand,
    createBrand,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateBrand,
  };
};
