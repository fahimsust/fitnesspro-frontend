export const useCategoryProductType = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getCategoryProductType(id: number) {
    const list: any = await useAsyncData("types", () =>
      $larafetch(`category/${id}/product/type`)
    );
    return list.data;
  }
  async function addProductType(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/product/type`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Product Type Added To Category successfully`,
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
  async function deleteCategoryProductType(category_id: number) {
    try{
      await $larafetch(`/category/${category_id}/product/type/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Product Type successfully removed from category`,
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
    await getCategoryProductType(category_id);
  }
  async function searchProductType(category_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&category_id=${category_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productTypeList: any = await useAsyncData("featuredProducts", () =>
      $larafetch(`/product-types?${paramString}`)
    );

    const productTypes = computed(() => productTypeList.data.value.data);
    const lastPage = computed(() => productTypeList.data.value.last_page);

    return {
      productTypes,
      lastPage,
      currentPage,
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getCategoryProductType,
    addProductType,
    deleteCategoryProductType,
    searchProductType,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
