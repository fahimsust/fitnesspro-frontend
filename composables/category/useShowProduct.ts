export const useShowProduct = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getShowProduct(id: number) {
    const list: any = await useAsyncData("show", () =>
      $larafetch(`category/${id}/product/show`)
    );
    return list.data;
  }
  async function updateShowProduct(formData: object, id: number, product_id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/product/show/${product_id}`, { method: "put", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Show Product Rank Updated successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        5000,
      );
    }
    return result.data;
  }
  async function addShowProduct(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/product/show`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Successfully Show",
            `Product successfully showed in category`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        5000,
      );
    }
    return result.data;
  }
  async function deleteShowProduct(category_id: number) {
    try{
      await $larafetch(`/category/${category_id}/product/show/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Product deleted from show`,
        "success"
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        3000
      );
    }  
    deleteConfirmationModal.value = false;
    await getShowProduct(category_id);
  }
  async function searchShowProduct(product_show_category_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&product_show_category_id=${product_show_category_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("showProducts", () =>
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
    getShowProduct,
    addShowProduct,
    deleteShowProduct,
    searchShowProduct,
    updateShowProduct,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
