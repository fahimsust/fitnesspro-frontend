export const useProductForm = () => {
  const deleteConfirmationModal = ref(false);
  let loading = ref(false);
  let removeId = 0;
  const errors: { [key: string]: any } = reactive({});
  const currentPage = ref(1);

  async function searchCustomForms(keword: string = "",id:number) {
    let paramString = `page=${currentPage.value}&keyword=${keword}&product_id=${id}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("customForms", () =>
      $larafetch(`/custom-form?${paramString}`)
    );

    const forms = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      forms,
      lastPage,
      currentPage,
    };
  }

  async function addUpdateProductForm(
    formData: object,
    id: number,
    edit: boolean
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/form`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        if (edit)
          swalTopEnd(
            "Added Successfully",
            `Product Form Updated successfully`,
            "success"
          );
        else
          swalTopEnd(
            "Added Successfully",
            `Product Form Added successfully`,
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
          swalTopEnd("Saved failed", erroString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function deleteProductForm(product_id: number) {
    try{
      await $larafetch(`/product/${product_id}/form/${removeId}`, { method: "delete" })
      swalTopEnd(
        "Deleted Successfully",
        `Product form successfully deleted`,
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
    await geProductForms(product_id);
  }

  async function geProductForms(id: number) {
    const list: any = await useAsyncData("productForms", () =>
      $larafetch(`product/${id}/form`)
    );
    return list.data;
  }
 
  function setRemoveId(id: number) {
    removeId = id;
  }

  return {
    setRemoveId,
    geProductForms,
    deleteProductForm,
    addUpdateProductForm,
    searchCustomForms,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
