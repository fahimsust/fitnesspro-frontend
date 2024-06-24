export const useConditionCountry = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function addConditionCountry(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-site/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Country Added successfully`,
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
  async function searchConditionCountry(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `siteCondition-${condition_id}`;
    const list: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/countries?${paramString}`)
    );
    return list.data;
  }
  async function updateConditionCountry(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-site/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionCountry(deleteId:number) {
    await useAsyncData("deleteCountry", () =>
      $larafetch(`/condition-site/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Country for Condition successfully removed`,
      "success"
    );
  }
  return {
    addConditionCountry,
    updateConditionCountry,
    deleteConditionCountry,
    searchConditionCountry,
    errors,
    loading
  };
};
