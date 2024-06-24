export const useConditionAttribute = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addConditionAttribute(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-attribute/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Attribute Added successfully`,
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
  async function searchConditionAttributes(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productAttributes-${condition_id}`;
    const attributeList: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/attribute-option-search?${paramString}`)
    );

    const attributes = computed(() => attributeList.data.value.data);
    const lastPage = computed(() => attributeList.data.value.last_page);

    return {
      attributes,
      lastPage,
      currentPage,
    };
  }
  async function updateConditionAttribute(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-attribute/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionAttribute(deleteId: number) {
    await useAsyncData("deleteConditionAttribute", () =>
      $larafetch(`/condition-attribute/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Attribute for Condition successfully deleted`,
      "success"
    );
  }
  return {
    addConditionAttribute,
    updateConditionAttribute,
    deleteConditionAttribute,
    searchConditionAttributes,
    errors,
    loading,
  };
};
