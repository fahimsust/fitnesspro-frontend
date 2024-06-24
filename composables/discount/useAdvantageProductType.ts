export const useAdvantageProductType = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addAdvantageProductType(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/advantage-product-type/", { method: "post", body: formData }),
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
  async function searchAdvantageProductType(
    advantage_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&advantage_id=${advantage_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productTypeAdvantages-${advantage_id}`;
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
  async function updateAdvantageProductType(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/advantage-product-type/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Advantage Updated successfully`,
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

  async function deleteAdvantageProductType(deleteId:number) {
    await useAsyncData("deleteProductType", () =>
      $larafetch(`/advantage-product-type/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product Type for Advantage successfully removed`,
      "success"
    );
  }
  return {
    addAdvantageProductType,
    updateAdvantageProductType,
    deleteAdvantageProductType,
    searchAdvantageProductType,
    errors,
    loading
  };
};
