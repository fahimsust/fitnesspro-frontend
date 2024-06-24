export const useAdvantageProduct = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addAdvantageProduct(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/advantage-product/", { method: "post", body: formData }),
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
  async function searchAdvantageProducts(
    advantage_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&advantage_id=${advantage_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productAdvantages-${advantage_id}`;
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
  async function updateAdvantageProduct(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/advantage-product/${id}`, { method: "put", body: formData }),
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

  async function deleteAdvantageProduct(deleteId: number) {
    await useAsyncData("deleteAdvantageProduct", () =>
      $larafetch(`/advantage-product/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product for Advantage successfully archived`,
      "success"
    );
  }
  return {
    addAdvantageProduct,
    updateAdvantageProduct,
    deleteAdvantageProduct,
    searchAdvantageProducts,
    errors,
    loading,
  };
};
