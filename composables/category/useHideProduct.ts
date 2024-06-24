export const useHideProduct = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getHideProduct(id: number) {
    const list: any = await useAsyncData("hide", () =>
      $larafetch(`category/${id}/product/hide`)
    );
    return list.data;
  }
  async function addHideProduct(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
       result = await submitRequest(
        $larafetch(`/category/${id}/product/hide`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Successfully Hide",
            `Product hide from category`,
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
  async function deleteHideProduct(category_id: number) {
    try{
      await $larafetch(`/category/${category_id}/product/hide/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Product Unhide Successfully`,
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
    await getHideProduct(category_id);
  }
  async function searchHideProduct(product_hide_category_id: number, keyword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&product_hide_category_id=${product_hide_category_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("hideProducts", () =>
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
    getHideProduct,
    addHideProduct,
    deleteHideProduct,
    searchHideProduct,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
