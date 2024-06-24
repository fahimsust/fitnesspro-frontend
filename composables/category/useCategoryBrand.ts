export const useCategoryBrand = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getCategoryBrand(id: number) {
    const list: any = await useAsyncData("brand", () =>
      $larafetch(`category/${id}/brand`)
    );
    return list.data;
  }
  async function addCategoryBrand(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category/${id}/brand`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Brand successfully Added To Category`,
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
  async function deletebrand(category_id: number) {
    try{
      await $larafetch(`/category/${category_id}/brand/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Brand successfully deleted from category`,
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
    await getCategoryBrand(category_id);
  }
  async function searchBrands(category_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&category_id=${category_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const brandList: any = await useAsyncData("featuredProducts", () =>
      $larafetch(`/brands?${paramString}`)
    );

    const brands = computed(() => brandList.data.value.data);
    const lastPage = computed(() => brandList.data.value.last_page);

    return {
      brands,
      lastPage,
      currentPage,
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getCategoryBrand,
    addCategoryBrand,
    deletebrand,
    searchBrands,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
