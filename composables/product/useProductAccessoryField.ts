export const useProductAccessoryField = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(1);

  async function geProductAccessoryField(id: number) {
    const list: any = await useAsyncData("accessories_fields", () =>
      $larafetch(`product/${id}/accessory-field`)
    );
    return list.data;
  }
  async function addUpdateProductAccessoryField(
    formData: object,
    id: number,
    edit: boolean
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/accessory-field`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        if (edit)
          swalTopEnd(
            "Added Successfully",
            `Product Accessory Field Updated successfully`,
            "success"
          );
        else
          swalTopEnd(
            "Added Successfully",
            `Product Accessory Field Added successfully`,
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
  
  async function deleteProductAccessoryField(product_id: number) {
    try{
      await $larafetch(`/product/${product_id}/accessory-field/${archiveId}`, { method: "delete" })
      swalTopEnd(
        "Deleted Successfully",
        `Product accessory Field successfully deleted`,
        "success"
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        10000
      );
    } 
    deleteConfirmationModal.value = false;
    await geProductAccessoryField(product_id);
  }
  async function searchProductAccessoryField(
    product_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&product_id=${product_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("productAccessory", () =>
      $larafetch(`/accessory-fields?${paramString}`)
    );

    const accessoryFields = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      accessoryFields,
      lastPage,
      currentPage,
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    geProductAccessoryField,
    addUpdateProductAccessoryField,
    deleteProductAccessoryField,
    searchProductAccessoryField,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
