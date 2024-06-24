export const useConditionOutOfStockStatus = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function addConditionOutOfStockStatus(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-out-of-stock-status/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Product Out of stock status Added successfully`,
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
  async function searchConditionOutOfStockStatus(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `outOfStockStatusCondition-${condition_id}`;
    const list: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/product-availabilities?${paramString}`)
    );
    return list.data;
  }
  async function updateConditionOutOfStockStatus(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-out-of-stock-status/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionOutOfStockStatus(deleteId:number) {
    await useAsyncData("deleteOutOfStockStatus", () =>
      $larafetch(`/condition-out-of-stock-status/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product Out of stock status removed successfully`,
      "success"
    );
  }
  return {
    addConditionOutOfStockStatus,
    updateConditionOutOfStockStatus,
    deleteConditionOutOfStockStatus,
    searchConditionOutOfStockStatus,
    errors,
    loading
  };
};
