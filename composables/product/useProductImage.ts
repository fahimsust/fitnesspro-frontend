export const useProductImage = (hasParent:number = 0) => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const deleteConfirmationModal = ref(false);
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  if(hasParent == 1)
  {
    currentPage.value = 1
  }

  async function productImages(product_id:number) {
    const list: any = await useAsyncData("productImages", () =>
      $larafetch(`/product/${product_id}/image`)
    );
    return list.data;
  }
  async function addProductImage(
    formData: object,
    product_id:number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${product_id}/image`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Product Image Added successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Add failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateCategoryImage(
    formData: object,
    product_id:number,
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${product_id}/category-image`, {
        method: "post",
        body: formData,
      }),
      async (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Product Category image Updated successfully`,
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
  async function updateDetailImage(
    formData: object,
    product_id:number,
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${product_id}/details-image`, {
        method: "post",
        body: formData,
      }),
      async (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Product Deatils image Updated successfully`,
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
  async function updateProductImage(
    formData: object,
    product_id:number,
    image_id:number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${product_id}/image/${image_id}`, {
        method: "put",
        body: formData,
      }),
      async (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Product image Updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Update failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteProductImage(product_id:number) {
    try{
      await $larafetch(`/product/${product_id}/image/${archiveId}`, { method: "delete" })
      swalTopEnd(
        "Deleted Successfully",
        `Product Image successfully deleted`,
        "success"
      );
      const{images} = await searchProductImages(product_id);
      if(images.value.length == 0)
      {
         if(currentPage.value > 1)
         {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await searchProductImages(product_id);
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
    await productImages(product_id);
    
  }
  async function searchProductImages(product_id: number) {
    let paramString = `page=${currentPage.value}&product_id=${product_id}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    const imageList: any = await useAsyncData("searchProductImages", () =>
      $larafetch(`product-images?${paramString}`)
    );
    const images = computed(() => imageList.data.value.data);
    const lastPage = computed(() => imageList.data.value.last_page);

    return {
      images,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }
  function resetPage() {
    currentPage.value = 1;
  }

  return {
    productImages,
    addProductImage,
    updateProductImage,
    deleteProductImage,
    searchProductImages,
    setArchiveId,
    updateCategoryImage,
    updateDetailImage,
    resetPage,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
