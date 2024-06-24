export const useConditionAccountType = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addConditionAccountType(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-account-type/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Account Type Added successfully`,
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
  async function searchConditionAccountTypes(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&discount_condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `productAccountTypes-${condition_id}`;
    const accountTYpeList: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/account-types?${paramString}`)
    );

    const accountTypes = computed(() => accountTYpeList.data.value.data);
    const lastPage = computed(() => accountTYpeList.data.value.last_page);

    return {
      accountTypes,
      lastPage,
      currentPage,
    };
  }
  async function updateConditionAccountType(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-account-type/${id}`, { method: "put", body: formData }),
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

  async function deleteConditionAccountType(deleteId: number) {
    await useAsyncData("deleteConditionAccountType", () =>
      $larafetch(`/condition-account-type/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Account Type for Condition successfully deleted`,
      "success"
    );
  }
  return {
    addConditionAccountType,
    updateConditionAccountType,
    deleteConditionAccountType,
    searchConditionAccountTypes,
    errors,
    loading,
  };
};
