export const useProductAccessory = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(1);

  async function geProductAccessory(id: number) {
    const list: any = await useAsyncData("accessories", () =>
      $larafetch(`product/${id}/accessory`)
    );
    return list.data;
  }
  async function addUpdateProductAccessory(
    formData: object,
    id: number,
    edit: boolean
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/accessory`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        if (edit)
          swalTopEnd(
            "Added Successfully",
            `Product Accessory Updated successfully`,
            "success"
          );
        else
          swalTopEnd(
            "Added Successfully",
            `Product Accessory Added successfully`,
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
  
  async function deleteProductAccessory(product_id: number) {
    try{
      await $larafetch(`/product/${product_id}/accessory/${archiveId}`, { method: "delete" })
      swalTopEnd(
        "Deleted Successfully",
        `Product accessory successfully deleted`,
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
    await geProductAccessory(product_id);
  }
  async function searchProductAccessory(
    product_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&accessory_product_id=${product_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("productAccessory", () =>
      $larafetch(`/product?${paramString}`)
    );

    const products = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      products,
      lastPage,
      currentPage,
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    geProductAccessory,
    addUpdateProductAccessory,
    deleteProductAccessory,
    searchProductAccessory,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
