export const useProductType = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  const keyword = route.query.keyword;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const attributeIdRoute = route.query.attribute_set_id;
  const attributeId = ref(
    typeof attributeIdRoute == "string" ? parseInt(attributeIdRoute) : 0
  );
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`
    if (attributeId.value > 0) {
      paramString = paramString + `&attribute_set_id=${attributeId.value}`;
    }
    const productTypeList: any = await useAsyncData("productTypes", () =>
      $larafetch(`/product-types?${paramString}`)
    );

    const productTypes = computed(() => productTypeList.data.value.data);
    const lastPage = computed(() => productTypeList.data.value.last_page);

    return {
      productTypes,
      lastPage,
      currentPage,
      keywordString,
      attributeId,
      orderBy,
      orderType
    };
  }
  async function deleteProductType() {
    try{
      await $larafetch(`/product-type/${archiveId}`, { method: "delete" })
       swalTopEnd(
        "Deleted Successfully",
        `Product Type successfully deleted`,
        "success"
      );
      const{productTypes} = await list();
      if(productTypes.value.length == 0)
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
  async function updateProductTypes(
    formData: object,
    id:number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product-type/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Product Type Updated successfully`,
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
  async function addProductTypes(
    formData: object,
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product-type`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Product Type Added successfully`,
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
  
  async function addProductTypeAttribteSet(formData: object,id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-type/${id}/attribute-set`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "",
          `Attribute set successfully saved`,
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

  async function addProductTypetaxRule(formData: object,id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-type/${id}/tax-rule`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "",
          `Tax rules successfully saved`,
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
  function setArchiveId(id: number) {
    archiveId = id;
  }
  async function taxRules() {
    const list: any = await useAsyncData("taxRules", () =>
      $larafetch(`/tax_rules`)
    );
    return list.data;
  }
  async function attributeSets() {
    const list: any = await useAsyncData("attributeSets", () =>
      $larafetch(`/attribute-set`)
    );
    return list.data;
  }

  return {
    setArchiveId,
    list,
    addProductTypeAttribteSet,
    updateProductTypes,
    addProductTypes,
    deleteProductType,
    addProductTypetaxRule,
    taxRules,
    attributeSets,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
