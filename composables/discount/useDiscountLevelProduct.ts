export const useDiscountLevelProduct = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);

  async function getDiscountLevelProduct(id: number) {
    const list: any = await useAsyncData("hide", () =>
      $larafetch(`discount-level/${id}/product`)
    );
    return list.data;
  }
  async function addDiscountLevelProduct(formData: object, id: number) {
    loading.value = true;
    let result: any = {}
    try {
      result = await submitRequest(
        $larafetch(`/discount-level/${id}/product`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Successfully Added",
            `Product added to discount level`,
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
    catch (error: any) {
      swalTopEnd(
        "",
        error.data?.message,
        "error",
        5000,
      );
    }
    return result.data;
  }
  async function deleteDiscountLevelProduct(discount_level_id: number) {
    try {
      await $larafetch(`/discount-level/${discount_level_id}/product/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Removed Successfully",
        `Product removed from discount level`,
        "success"
      );
    }
    catch (error: any) {
      swalTopEnd(
        "",
        error.data?.message,
        "error",
        3000
      );
    }
    deleteConfirmationModal.value = false;
    await getDiscountLevelProduct(discount_level_id);
  }
  async function searchDiscountLevelProduct(discount_level_id: number, keyword: string = "") {
    let paramString = `page=${currentPage.value
      }&discount_level_id=${discount_level_id}&keyword=${keyword}&per_page=${useRuntimeConfig().public.perPage
      }`;
    const productList: any = await useAsyncData("discountLevelProducts", () =>
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
    getDiscountLevelProduct,
    addDiscountLevelProduct,
    deleteDiscountLevelProduct,
    searchDiscountLevelProduct,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
