export const useSiteCategory = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getSiteCategories(id: number) {
    const list: any = await useAsyncData("siteCategories", () =>
      $larafetch(`site/${id}/category`)
    );
    return list.data;
  }
  async function addFilterCategory(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/category-filter`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Filter category successfully saved`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 5000);
    }
    return result.data;
  }
  async function addSiteCategory(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/category`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Category successfully added To Site`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 5000);
    }
    return result.data;
  }
  async function deleteSiteCategory(id: number) {
    try {
      await $larafetch(`/site/${id}/category/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Category successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteCategories(id);
  }
  async function searchCategory(site_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&site_id=${site_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const categoryList: any = await useAsyncData("categories", () =>
      $larafetch(`/categories?${paramString}`)
    );

    const categories = computed(() => categoryList.data.value.data);
    const lastPage = computed(() => categoryList.data.value.last_page);

    return {
      categories,
      lastPage,
      currentPage,
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getSiteCategories,
    addSiteCategory,
    deleteSiteCategory,
    searchCategory,
    addFilterCategory,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
