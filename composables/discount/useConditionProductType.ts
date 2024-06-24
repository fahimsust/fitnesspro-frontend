export const useConditionProductType = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addConditionProductType(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-product-type/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Product Type Added successfully`,
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
  async function searchConditionProductType(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productTypeConditions-${condition_id}`;
    const productTypeList: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/product-types?${paramString}`)
    );

    const productTypes = computed(() => productTypeList.data.value.data);
    const lastPage = computed(() => productTypeList.data.value.last_page);

    return {
      productTypes,
      lastPage,
      currentPage,
    };
  }
  async function updateConditionProductType(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-product-type/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionProductType(deleteId:number) {
    await useAsyncData("deleteProductType", () =>
      $larafetch(`/condition-product-type/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product Type for Condition successfully removed`,
      "success"
    );
  }
  return {
    addConditionProductType,
    updateConditionProductType,
    deleteConditionProductType,
    searchConditionProductType,
    errors,
    loading
  };
};
