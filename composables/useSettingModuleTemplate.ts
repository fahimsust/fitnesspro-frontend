export const useSettingModuleTemplate = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteSettingsModulesSection(id: any) {
    let params = ""
    if (id != 0 && id != null) {
      params = `?module_template_id=${id}`
    }
    const list: any = await useAsyncData("moduleSections", () =>
      $larafetch(`site/module/sections${params}`)
    );
    return list.data;
  }
  async function getSiteSettingsModulesValue(
    site_id: number,
    section: string,
    module_id: number,
    section_id: number
  ) {
    const site_id_change = site_id == 0 ? '' : site_id
    const paramString = `site_id=${site_id_change}&section=${section}&module_id=${module_id}&section_id=${section_id} `;
    const list: any = await useAsyncData("moduleFieldValue", () =>
      $larafetch(`site/module-value?${paramString}`)
    );
    return list.data;
  }
  async function addUpdateSiteSettingsModulesValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`site/module-value`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getProductSiteSettingsModulesSection(id: any) {
    let params = ""
    if (id != 0 && id != null) {
      params = `?module_template_id=${id}`
    }
    const list: any = await useAsyncData("moduleSections", () =>
      $larafetch(`product-module/sections${params}`)
    );
    return list.data;
  }
  async function getProductSiteSettingsModulesValue(
    site_id: number,
    product_id: number,
    module_id: number,
    section_id: number
  ) {
    const site_id_change = site_id == 0 ? '' : site_id
    const paramString = `site_id=${site_id_change}&product_id=${product_id}&module_id=${module_id}&section_id=${section_id} `;
    const list: any = await useAsyncData("moduleFieldValue", () =>
      $larafetch(`product-module-value?${paramString}`)
    );
    return list.data;
  }
  async function addUpdateProductSiteSettingsModulesValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-module-value`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getCategorySiteSettingsModulesSection(id: any) {
    let params = ""
    if (id != 0 && id != null) {
      params = `?module_template_id=${id}`
    }
    const list: any = await useAsyncData("moduleSections", () =>
      $larafetch(`category-module/sections${params}`)
    );
    return list.data;
  }
  async function getCategorySiteSettingsModulesValue(
    site_id: number,
    category_id: number,
    module_id: number,
    section_id: number
  ) {
    const site_id_change = site_id == 0 ? '' : site_id
    const paramString = `site_id=${site_id_change}&category_id=${category_id}&module_id=${module_id}&section_id=${section_id} `;
    const list: any = await useAsyncData("moduleFieldValue", () =>
      $larafetch(`category-module-value?${paramString}`)
    );
    return list.data;
  }
  async function addUpdateCategorySiteSettingsModulesValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`category-module-value`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }


  async function getCategoryTemplateSettingsModulesSection(id: any) {
    let params = ""
    if (id != 0 && id != null) {
      params = `?module_template_id=${id}`
    }
    const list: any = await useAsyncData("categorySettingModuleSections", () =>
      $larafetch(`category-settings-template-module/sections${params}`)
    );
    return list.data;
  }
  async function getCategoryTemplateSettingsModulesValue(
    settings_template_id: number,
    module_id: number,
    section_id: number
  ) {
    const paramString = `settings_template_id=${settings_template_id}&module_id=${module_id}&section_id=${section_id} `;
    const list: any = await useAsyncData("categorySettingModuleFieldValue", () =>
      $larafetch(`category-settings-template-module-value?${paramString}`)
    );
    return list.data;
  }
  async function addUpdateCategoryTemplateSettingsModulesValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`category-settings-template-module-value`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getProductTemplateSettingsModulesSection(id: any) {
    let params = ""
    if (id != 0 && id != null) {
      params = `?module_template_id=${id}`
    }
    const list: any = await useAsyncData("productSettingModuleSections", () =>
      $larafetch(`product-settings-template-module/sections${params}`)
    );
    return list.data;
  }

  async function getProductTemplateSettingsModulesValue(
    settings_template_id: number,
    module_id: number,
    section_id: number
  ) {
    const paramString = `settings_template_id=${settings_template_id}&module_id=${module_id}&section_id=${section_id} `;
    const list: any = await useAsyncData("productSettingModuleFieldValue", () =>
      $larafetch(`product-settings-template-module-value?${paramString}`)
    );
    return list.data;
  }
  async function addUpdateProductTemplateSettingsModulesValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-settings-template-module-value`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  return {
    getSiteSettingsModulesSection,
    getSiteSettingsModulesValue,
    addUpdateSiteSettingsModulesValue,
    getProductSiteSettingsModulesSection,
    getProductSiteSettingsModulesValue,
    addUpdateProductSiteSettingsModulesValue,
    getCategorySiteSettingsModulesSection,
    getCategorySiteSettingsModulesValue,
    addUpdateCategorySiteSettingsModulesValue,
    getCategoryTemplateSettingsModulesSection,
    getCategoryTemplateSettingsModulesValue,
    addUpdateCategoryTemplateSettingsModulesValue,
    getProductTemplateSettingsModulesValue,
    addUpdateProductTemplateSettingsModulesValue,
    getProductTemplateSettingsModulesSection,
    errors,
    loading,
  };
};
