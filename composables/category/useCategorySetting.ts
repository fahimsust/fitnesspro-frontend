export const useCategorySetting = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function addUpdateCategorySetting(
    formData: object,
    id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/settings-template/`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Updated",
          `Category Setting successfully updated`,
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
    return result.data;
  }

  async function geCategorySettings(id: number) {
    const list: any = await useAsyncData("categorySettings", () =>
      $larafetch(`category/${id}/settings-template/`)
    );
    return list.data;
  }


  return {
    geCategorySettings,
    addUpdateCategorySetting,
    errors,
    loading,
  };
};
