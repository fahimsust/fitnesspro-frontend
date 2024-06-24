export const useFeaturedProduct = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getFeaturedProduct(id: number) {
    const list: any = await useAsyncData("featured", () =>
      $larafetch(`category/${id}/product/featured`)
    );
    return list.data;
  }
  async function updateFeatureProduct(formData: object, id: number, product_id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/product/featured/${product_id}`, { method: "put", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Featured Product Rank Updated successfully`,
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
  async function addFeaturedProduct(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/product/featured`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Featured Product Added To Category successfully`,
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
  async function deleteFeaturedProduct(category_id: number) {
    try{
      await $larafetch(`/category/${category_id}/product/featured/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Featured Product successfully deleted`,
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
    await getFeaturedProduct(category_id);
  }
  async function searchFeaturedProduct(feature_category_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&feature_category_id=${feature_category_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("featuredProducts", () =>
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
    getFeaturedProduct,
    addFeaturedProduct,
    deleteFeaturedProduct,
    searchFeaturedProduct,
    updateFeatureProduct,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
