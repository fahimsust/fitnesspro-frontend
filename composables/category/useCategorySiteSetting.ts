export const useCategorySiteSetting = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function addUpdateCategorySiteSetting(
    formData: object,
    id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/settings-template/site/`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Updated",
          `Category Site Setting successfully updated`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("", errors.settings_template_id, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function geCategorySiteSettings(id: number) {
    const list: any = await useAsyncData("categorySiteSettings", () =>
      $larafetch(`category/${id}/settings-template/site`)
    );
    return list.data;
  }
  async function getSettingTemplate() {
    const list: any = await useAsyncData("settingTemplate", () =>
      $larafetch(`category-settings-template`)
    );
    return list.data;
  }


  return {
    geCategorySiteSettings,
    addUpdateCategorySiteSetting,
    errors,
    loading,
    getSettingTemplate,
  };
};
