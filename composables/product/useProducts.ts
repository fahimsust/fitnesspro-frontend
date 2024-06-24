import {SUCCESS_MSG} from '~/constant/success.msg'
import {ERROR_MSG} from '~/constant/error.msg'
export const useProducts = () => {
  const route = useRoute();
  const router = useRouter();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const trashedRoute = route.query.trashed;
  const hideChildrenRoute = route.query.hide_children;
  const typeIdRoute = route.query.type_id;
  const brandIdRoute = route.query.brand_id;
  const trashed = ref(
    typeof trashedRoute == "string" ? parseInt(trashedRoute) : 0
  );
  const hideChildren = ref(
    typeof hideChildrenRoute == "string" ? parseInt(hideChildrenRoute) : 0
  );
  const typeId = ref(
    typeof typeIdRoute == "string" ? parseInt(typeIdRoute) : 0
  );
  const brandId = ref(
    typeof brandIdRoute == "string" ? parseInt(brandIdRoute) : 0
  );
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  async function updateContent(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/content`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product content updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function updateDetail(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/details`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product Details updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateMeta(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/meta-data`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product Meta Data updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function productDistributors(id:number) {
    const list: any = await useAsyncData("productDistributors", () =>
      $larafetch(`/product/${id}/distributor-inventory/`)
    );
    return list.data;
  }

  async function updateDistributorInventory(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/distributor-inventory`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.SAVED_SUCCESS,
          `Product Inventory Saved successfully`,
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

  async function updateInventory(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/default-inventory`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product Inventory updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateCustomInfo(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/customs-info`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product Custom Information updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateAddToCartSetting(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/add-to-cart-settings`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product Cart Setting updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  //Product
  async function getProduct(id: number) {
    const result: any = await useLazyAsyncData("product", () =>
      $larafetch(`/product/${id}`)
    );
    return result.data;
  }
  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&per_page=${useRuntimeConfig().public.perPage}&trashed=${
      trashed.value == 1 ? 1 : ""
    }&hide_children=${hideChildren.value == 1 ? 1 : ""}&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }`;
    if (typeId.value > 0) {
      paramString = paramString + `&type_id=${typeId.value}`;
    }
    if (brandId.value > 0) {
      paramString = paramString + `&brand_id=${brandId.value}`;
    }
    const productList: any = await useAsyncData("products", () =>
      $larafetch(`/product?${paramString}`)
    );

    const products = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      products,
      lastPage,
      currentPage,
      keywordString,
      trashed,
      hideChildren,
      typeId,
      brandId,
      orderBy,
      orderType
    };
  }
  async function updateProduct(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.UPDATE_SUCCESS,
          `Product updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function createProduct(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/product/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          SUCCESS_MSG.CREATE_SUCCESS,
          SUCCESS_MSG.PRODUCT_CREATE_SUCCESS,
          "success"
        );
        router.push({ path: "/catalog/products/" + result.id });
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  //Product

  //Suporitng Methdod
  async function brands() {
    const list: any = await useAsyncData("brands", () => $larafetch(`/brand`));
    return list.data;
  }
  async function categories() {
    const list: any = await useAsyncData("categories", () =>
      $larafetch(`/category`)
    );
    return list.data;
  }
  async function types() {
    const list: any = await useAsyncData("types", () =>
      $larafetch(`/product-type`)
    );
    return list.data;
  }
  async function distributors() {
    const list: any = await useAsyncData("distributors", () =>
      $larafetch(`/distributors`)
    );
    return list.data;
  }
  async function fulfillmentrules() {
    const list: any = await useAsyncData("fulfillmentrules", () =>
      $larafetch(`/ful-fillment-rules`)
    );
    return list.data;
  }
  async function availabilities() {
    const list: any = await useAsyncData("availabilities", () =>
      $larafetch(`/product-availabilities`)
    );
    return list.data;
  }
  async function archive() {

    try {
      await $larafetch(`/product/${archiveId}/archive`, {
        method: "post",
      });
      swalTopEnd(
        SUCCESS_MSG.SUCCESSFULLY_ARCHIVED,
        SUCCESS_MSG.PRODUCT_SUCCESSFULLY_ARCHIVED,
        "success"
      );
      const{products} = await list();
      if(products.value.length == 0)
      {
          if(currentPage.value > 1)
          {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await list();
          }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function restore(id: number) {
    try {
      await $larafetch(`/product/${id}/restore`, {
        method: "post",
      });
      swalTopEnd(
        "Restore Successfully",
        `Product successfully Restored`,
        "success"
      );
      const{products} = await list();
      if(products.value.length == 0)
      {
          if(currentPage.value > 1)
          {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await list();
          }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }

  async function updateTranslatedProduct(formData: object, id: number,language_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/translation/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(SUCCESS_MSG.UPDATE_SUCCESS, SUCCESS_MSG.PRODUCT_UPDATE_SUCCESS, "success");
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getTranslatedProduct(id: number,language_id:number) {
    const result: any = await useAsyncData("translatedProduct", () =>
      $larafetch(`/product/${id}/translation/${language_id}`)
    );
    return result.data;
  }
  async function updateTranslatedMeta(formData: object, id: number,language_id:number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/product/${id}/meta-translation/${language_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(SUCCESS_MSG.UPDATE_SUCCESS, `Meta Data Updated successfully`, "success");
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  async function updateTranslatedContent(formData: object, id: number,language_id:number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/product/${id}/content-translation/${language_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(SUCCESS_MSG.UPDATE_SUCCESS, `Product Details Updated successfully`, "success");
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  async function updateTranslatedCustomInfo(formData: object, id: number,language_id:number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/product/${id}/customs-translation/${language_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(SUCCESS_MSG.UPDATE_SUCCESS, `Product Custom Information Updated successfully`, "success");
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd(ERROR_MSG.UPDATE_FAILED, ERROR_MSG.SOLVE_ERROR, "error");
        }
      },
      () => (loading.value = false)
    );
  }


  function setArchiveId(id: number) {
    archiveId = id;
  }
  

  function resetPage() {
    currentPage.value = 1;
  }
  //Supporting Method

  return {
    list,
    brands,
    types,
    archive,
    restore,
    setArchiveId,
    createProduct,
    updateProduct,
    getProduct,
    updateMeta,
    updateCustomInfo,
    updateAddToCartSetting,
    distributors,
    fulfillmentrules,
    availabilities,
    updateInventory,
    categories,
    updateDetail,
    updateContent,
    resetPage,
    productDistributors,
    updateDistributorInventory,
    updateTranslatedProduct,
    getTranslatedProduct,
    updateTranslatedMeta,
    updateTranslatedContent,
    updateTranslatedCustomInfo,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
