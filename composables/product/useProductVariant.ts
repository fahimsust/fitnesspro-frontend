export const useProductVariant = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
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

  async function variantList(id:number) {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`
    const variantList: any = await useAsyncData("product-variants", () =>
      $larafetch(`product/${id}/product-variant?${paramString}`)
    );

    const variants = computed(() => variantList.data.value.data);
    const lastPage = computed(() => variantList.data.value.last_page);

    return {
      variants,
      lastPage,
      currentPage,
      keywordString,
      orderBy,
      orderType
    };
  }
  async function awaitingList(id:number) {
    const awaiting: any = await useAsyncData("awaitingList", () =>
      $larafetch(`product/${id}/product-awaiting-variant`)
    );
    const awaitingVariants = awaiting.data
    return awaitingVariants;
  }
  async function updateProductVariant(formData: object,method: string) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`variant-bulk-update/${method}`, {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Saved",
          `Values saved successfully`,
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
  async function createVariant(id:number,formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch(`product/${id}/product-awaiting-variant/`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Product Variant created successfully`,
          "success"
        );
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
  async function deleteProductVariant(id: number) {
    try {
      await $larafetch(`product/${archiveId}/product-variant/${id}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Product variant successfully deleted`,
        "success"
      );
      const{variants} = await variantList(id);
      if(variants.value.length == 0)
      {
         if(currentPage.value > 1)
         {
          createNewPathAndPush("page",(currentPage.value-1).toString(), true);
          currentPage.value = currentPage.value-1
          await await variantList(id);
         }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    await summary(id);
  }
  //Product
  function setArchiveId(id: number) {
    archiveId = id;
  }
  async function summary(id:number) {
    const summary: any = await useAsyncData(`product-variant-summary`, () => $larafetch(`/product/${id}/product-variant-summary`));
    const summaryData = summary.data
    return summaryData;
  }
  

  function resetPage() {
    currentPage.value = 1;
  }
  //Supporting Method

  return {
    variantList,
    summary,
    setArchiveId,
    deleteProductVariant,
    updateProductVariant,
    awaitingList,
    createVariant,
    resetPage,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
