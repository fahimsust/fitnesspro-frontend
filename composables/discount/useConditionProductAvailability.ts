export const useConditionProductAvailability = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function addConditionAvailability(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-availability/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Product availability status Added successfully`,
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
  async function searchConditionAvailability(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `availability_condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `availabilityCondition-${condition_id}`;
    const list: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/product-availabilities?${paramString}`)
    );
    return list.data;
  }
  async function updateConditionAvailability(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-availability/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionAvailability(deleteId:number) {
    await useAsyncData("deleteAvailability", () =>
      $larafetch(`/condition-availability/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Product availability status for Condition successfully removed`,
      "success"
    );
  }
  return {
    addConditionAvailability,
    updateConditionAvailability,
    deleteConditionAvailability,
    searchConditionAvailability,
    errors,
    loading
  };
};
