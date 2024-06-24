export const useProductOption = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const deleteConfirmationModal = ref(false);
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function productOptionTypes() {
    const list: any = await useAsyncData("productOptionTypes", () =>
      $larafetch(`/product-option-types`)
    );
    return list.data;
  }
  async function optionCustomValue(productOptionValueId: number) {
    const customValue: any = await useAsyncData(
      "productOptionCustomValue",
      () =>
        $larafetch(`/product-option-value/${productOptionValueId}/custom-field`)
    );
    return customValue.data;
  }

  async function addProductDateOptionValue(
    formData: object,
    productOptionValueId: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option-values/${productOptionValueId}`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Option Value for date range Added successfully`,
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

  async function addProductCustomOptionValue(
    formData: object,
    productOptionValueId: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option-value/${productOptionValueId}/custom-field`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Option Value Updated successfully`,
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
  async function deleteProductCustomOptionValue(productOptionValueId: number) {
    await useAsyncData("dCustomOptionValue", () =>
      $larafetch(`product-option-value/${productOptionValueId}/custom-field`, {
        method: "delete",
      })
    );
  }
  async function getProductOptionValues(
    productOptionId: number,
    formObj: any,
    keword: string = ""
  ) {
    let paramString = `page=${currentPage.value}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    if (formObj.start_date) {
      const dateString = dbDateFormat(formObj.start_date);
      paramString = paramString + `&start_date=${dateString}`;
    }
    if (formObj.end_date) {
      const dateString = dbDateFormat(formObj.end_date);
      paramString = paramString + `&end_date=${dateString}`;
    }

    const optionValueList: any = await useAsyncData(
      "getProductOptionValues",
      () =>
        $larafetch(`product-option-values/${productOptionId}?${paramString}`)
    );
    const optionValues = computed(() => optionValueList.data.value.data);
    const lastPage = computed(() => optionValueList.data.value.last_page);

    return {
      optionValues,
      lastPage,
      currentPage,
    };
  }

  async function addProductOptionValue(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option-value`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Option Value Added successfully`,
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
  async function updateProductOptionValue(
    formData: object,
    customFormData: object,
    is_custom: boolean,
    is_custom_old: boolean,
    productOptionValueId: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option-value/${productOptionValueId}`, {
        method: "put",
        body: formData,
      }),
      async (result: any) => {
        clearValidationErrors(errors);
        if (is_custom) {
          await addProductCustomOptionValue(
            customFormData,
            productOptionValueId
          );
        } else {
          if (is_custom_old)
            await deleteProductCustomOptionValue(productOptionValueId);

          swalTopEnd(
            "Added Successfully",
            `Product Option Value Updated successfully`,
            "success"
          );
        }
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

  async function deleteProductOptionValue() {
    try {
      await $larafetch(`/product-option-value/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Product Option Value successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }

  async function getProductOption(id: number) {
    let paramString = `page=${currentPage.value}&product_id=${id}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const optionList: any = await useAsyncData("productOption", () =>
      $larafetch(`product-option?${paramString}`)
    );

    const options = computed(() => optionList.data.value.data);
    const lastPage = computed(() => optionList.data.value.last_page);

    return {
      options,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function addProductOption(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Option Added successfully`,
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
  async function updateProductOption(
    formData: object,
    productOptionId: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-option/${productOptionId}`, {
        method: "put",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Option Updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let erroString = "";
          for (const [_, value] of Object.entries(errors)) {
            erroString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Update failed", erroString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteProductOption(id: number) {
    try {
      await $larafetch(`/product-option/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Product Option successfully deleted`,
        "success"
      );
      const{options} = await getProductOption(id);
      if(options.value.length == 0)
      {
         if(currentPage.value > 1)
         {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await getProductOption(id);
         }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateTranslatedProductOption(formData: object, id: number,language_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product-option/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd("Updated Successfully", `Product Option Updated successfully`, "success");
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

  async function getTranslatedProductOption(id: number,language_id:number) {
    const result: any = await useAsyncData("translatedProductOption", () =>
      $larafetch(`/product-option/${id}/translation/${language_id}`)
    );
    return result.data;
  }

  async function updateTranslatedProductOptionValue(formData: object, id: number,language_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product-option-value/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd("Updated Successfully", `Product Option Value Updated successfully`, "success");
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

  async function getTranslatedProductOptionValue(id: number,language_id:number) {
    const result: any = await useAsyncData("translatedProductOptionValue", () =>
      $larafetch(`/product-option-value/${id}/translation/${language_id}`)
    );
    return result.data;
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }
  function resetPage() {
    currentPage.value = 1;
  }

  return {
    setArchiveId,
    updateProductOption,
    addProductOption,
    deleteProductOption,
    getProductOption,
    getProductOptionValues,
    addProductOptionValue,
    updateProductOptionValue,
    deleteProductOptionValue,
    deleteProductCustomOptionValue,
    addProductDateOptionValue,
    addProductCustomOptionValue,
    productOptionTypes,
    resetPage,
    optionCustomValue,
    getTranslatedProductOptionValue,
    updateTranslatedProductOptionValue,
    updateTranslatedProductOption,
    getTranslatedProductOption,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
