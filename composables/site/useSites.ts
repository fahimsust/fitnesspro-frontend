export const useSites = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function list() {
    const result: any = await useAsyncData("sites", () =>
      $larafetch(`/site/`)
    );
    return result.data;
  }
  async function getSite(id:number) {
    const result: any = await useAsyncData("site", () =>
      $larafetch(`/site/${id}`)
    );
    return result.data;
  }
 
  async function updateSite(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site Updated successfully`,
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
  async function addSite(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd("Added Successfully", `New site added successfully`, "success");
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Add failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateSiteMeta(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/update-meta`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site meta data updated successfully`,
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
  async function updateTranslatedSite(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site Updated successfully`,
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

  async function getTranslatedSite(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedSite", () =>
      $larafetch(`/site/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  

  return {
    list,
    getSite,
    updateSite,
    updateTranslatedSite,
    getTranslatedSite,
    updateSiteMeta,
    addSite,
    errors,
    loading,
  };
};
