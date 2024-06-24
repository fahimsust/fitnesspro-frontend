export const useConditionProduct = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addConditionProduct(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-product/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Product Added successfully`,
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
  }
  async function searchConditionProducts(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productConditions-${condition_id}`;
    const productList: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/product?${paramString}`)
    );

    const products = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      products,
      lastPage,
      currentPage,
    };
  }
  async function updateConditionProduct(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-product/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Condition Updated successfully`,
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

  async function deleteConditionProduct(deleteId: number) {
    await useAsyncData("deleteConditionProduct", () =>
      $larafetch(`/condition-product/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product for Condition successfully deleted`,
      "success"
    );
  }
  return {
    addConditionProduct,
    updateConditionProduct,
    deleteConditionProduct,
    searchConditionProducts,
    errors,
    loading,
  };
};
