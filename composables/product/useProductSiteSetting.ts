export const useProductSiteSetting = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function addUpdateProductSiteSetting(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/site-setting`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Updated",
          `Product Site Setting successfully updated`,
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

  async function getProductSiteSettings(id: number) {
    const list: any = await useAsyncData("productSiteSettings", () =>
      $larafetch(`product/${id}/site-setting`)
    );
    return list.data;
  }
  async function getModuleTemplate() {
    const list: any = await useAsyncData("moduleTemplate", () =>
      $larafetch(`module-template`)
    );
    return list.data;
  }
  async function getLayout() {
    const list: any = await useAsyncData("layouts", () => $larafetch(`layout`));
    return list.data;
  }
  async function getSettingTemplate() {
    const list: any = await useAsyncData("settingTemplate", () =>
      $larafetch(`product-settings-template`)
    );
    return list.data;
  }
  async function getDisplayTemplateZoom() {
    const list: any = await useAsyncData("displayTemplateZoom", () =>
      $larafetch(`display-template-zoom`)
    );
    return list.data;
  }
  async function getDisplayTemplateDetail() {
    const list: any = await useAsyncData("displayTemplateDetail", () =>
      $larafetch(`display-template-detail`)
    );
    return list.data;
  }
  async function getDisplayTemplateThumbnail() {
    const list: any = await useAsyncData("displayTemplateThumbnail", () =>
      $larafetch(`display-template-thumbnail`)
    );
    return list.data;
  }
  async function getDisplayTemplateCategory() {
    const list: any = await useAsyncData("displayTemplateCategory", () =>
      $larafetch(`display-template-category`)
    );
    return list.data;
  }
  async function getSearchForms() {
    const list: any = await useAsyncData("getSearchForms", () =>
      $larafetch(`search-form`)
    );
    return list.data;
  }

  return {
    getProductSiteSettings,
    addUpdateProductSiteSetting,
    errors,
    loading,
    getModuleTemplate,
    getLayout,
    getSettingTemplate,
    getDisplayTemplateZoom,
    getDisplayTemplateDetail,
    getDisplayTemplateThumbnail,
    getDisplayTemplateCategory,
    getSearchForms
  };
};
