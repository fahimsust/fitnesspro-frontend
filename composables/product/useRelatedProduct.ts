export const useRelatedProduct = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(1);

  async function getRelatedProduct(id: number) {
    const list: any = await useAsyncData("related", () =>
      $larafetch(`product/${id}/related`)
    );
    return list.data;
  }
  async function addRelatedProduct(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/related`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Related Product Added successfully`,
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
  async function deleteRelatedProduct(product_id: number) {
    try {
      await $larafetch(`/product/${product_id}/related/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Related Product successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    await getRelatedProduct(product_id);
  }
  async function searchRelatedProduct(product_id: number, keword: string = "") {
    let paramString = `page=${
      currentPage.value
    }&product_id=${product_id}&keyword=${keword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const productList: any = await useAsyncData("relatedProducts", () =>
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
    getRelatedProduct,
    addRelatedProduct,
    deleteRelatedProduct,
    searchRelatedProduct,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
