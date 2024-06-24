export const useCategories = () => {
  const route = useRoute();
  const router = useRouter();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const deleteConfirmationModal = ref(false);
  let categoryId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function updateTranslationMeta(formData: object, id: number,language_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/meta-translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Meta Data updated successfully`,
          "success"
        );
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

  //Product
  async function getCategoryTranslation(id: number,language_id:number) {
    const result: any = await useAsyncData("categoryTranslation", () =>
      $larafetch(`/category/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function updateTranslationCategory(formData: object, id: number,language_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/translation/${language_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category updated successfully`,
          "success"
        );
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

  async function updateCategoryParent(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/parent`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Parent updated successfully`,
          "success"
        );
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

  async function updateImage(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/image`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Image updated successfully`,
          "success"
        );
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

  async function updateMenuSetting(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/menu-setting`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Menu Setting updated successfully`,
          "success"
        );
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
  async function updateCategoryFilter(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/filter`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Filter Setting updated successfully`,
          "success"
        );
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
  async function updateMeta(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}/meta-data`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category Meta Data updated successfully`,
          "success"
        );
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

  //Product
  async function getCategory(id: number) {
    const result: any = await useAsyncData("category", () =>
      $larafetch(`/category/${id}`)
    );
    return result.data;
  }
  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    
    const categoryList: any = await useAsyncData("categories", () =>
      $larafetch(`/categories?${paramString}`)
    );

    const categories = computed(() => categoryList.data.value.data);
    const lastPage = computed(() => categoryList.data.value.last_page);

    return {
      categories,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function updateCategory(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Category updated successfully`,
          "success"
        );
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
  async function createCategory(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/category/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Category created successfully`,
          "success"
        );
        router.push({ path: "/catalog/categories/" + result.id });
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  //Product

  //Suporitng Methdod
  async function parentCategories(id:number = 0) {
    let paramString = ""
    if(id != 0)
    {
      paramString = `?category_id=${id}`
    }
    const list: any = await useAsyncData("parentCategories", () =>
      $larafetch(`/parent/category/${paramString}`)
    );
    return list.data;
  }
  async function deleteCategory() {
    try{
      await $larafetch(`/category/${categoryId}`, { method: "delete" })
       swalTopEnd(
        "Archived Successfully",
        `Category successfully archived`,
        "success"
      );
      const{categories} = await list();
      if(categories.value.length == 0)
      {
         if(currentPage.value > 1)
         {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await list();
         }
      }
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
    
  }
  async function statusChange(formData: object,id:number) {
    await useAsyncData("statusChange", () =>
      $larafetch(`/category/${id}/status`, { method: "post" ,body: formData})
    );
    swalTopEnd(
      "Status Change",
      `Category Status Change`,
      "success"
    );
    await list();
  }
  function setCategoryId(id: number) {
    categoryId = id;
  }
  

  function resetPage() {
    currentPage.value = 1;
  }
  //Supporting Method

  return {
    list,
    deleteCategory,
    setCategoryId,
    createCategory,
    updateCategory,
    getCategory,
    updateMeta,
    parentCategories,
    updateMenuSetting,
    updateCategoryParent,
    statusChange,
    resetPage,
    updateImage,
    updateCategoryFilter,
    updateTranslationCategory,
    getCategoryTranslation,
    updateTranslationMeta,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
