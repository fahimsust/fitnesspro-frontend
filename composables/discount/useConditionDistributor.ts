export const useConditionDistributor = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function addConditionDistributor(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-distributor/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Distributor Added successfully`,
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
  async function searchConditionDistributor(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `distributorCondition-${condition_id}`;
    const list: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/distributors?${paramString}`)
    );
    return list.data;
  }
  async function updateConditionDistributor(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-distributor/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionDistributor(deleteId:number) {
    await useAsyncData("deleteDistributor", () =>
      $larafetch(`/condition-distributor/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Distributor for Condition successfully removed`,
      "success"
    );
  }
  return {
    addConditionDistributor,
    updateConditionDistributor,
    deleteConditionDistributor,
    searchConditionDistributor,
    errors,
    loading
  };
};
