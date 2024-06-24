export const useCustomFields = () => {
  const deleteConfirmationModal = ref(false);
  const currentPage = ref(1);
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function list(keyword: string = "") {
    let paramString = `page=${currentPage.value}&keyword=${keyword}&per_page=${useRuntimeConfig().public.perPage}`;
    const customFieldList: any = await useAsyncData("customFields", () =>
      $larafetch(`/custom-field?${paramString}`)
    );

    const customFields = computed(() => customFieldList.data.value.data);
    const lastPage = computed(() => customFieldList.data.value.last_page);

    return {
      customFields,
      lastPage,
      currentPage,
    };
  }
 
  async function updateCustomField(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-field/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Custom Field Updated successfully`,
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

  async function addCustomField(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-field`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Custom Field Added successfully`,
          "success"
        );
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
  
  async function getCustomField(id: number) {
    const result: any = await useAsyncData("customField", () =>
      $larafetch(`/custom-field/${id}`)
    );
    return result.data;
  }

  async function updateTranslatedField(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/custom-field/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Custom Field Updated successfully`,
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

  async function getTranslatedField(id: number, language_id: number) {
    const result: any = await useAsyncData("translatedForm", () =>
      $larafetch(`/custom-field/${id}/translation/${language_id}`)
    );
    return result.data;
  }



  return {
    list,
    getCustomField,
    updateCustomField,
    addCustomField,
    updateTranslatedField,
    getTranslatedField,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
