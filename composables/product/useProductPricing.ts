export const useProductPricing = () => {
  const deleteConfirmationModal = ref(false);
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const currentPage = ref(1);

  async function getPrices(id: number) {
    const list: any = await useAsyncData("prices", () =>
      $larafetch(`product/${id}/pricing`)
    );
    const priceList = list.data
    return priceList
  }
  async function getPrice(id: number,product_id:number) {
    const productData: any = await useAsyncData("price", () =>
      $larafetch(`product/${product_id}/pricing/${id}`)
    );
    return productData.data
  }
  async function getChildPrices(id: number,keyword:String = "",site_id:string='') {
    let paramString = `page=${currentPage.value}&product_id=${id}&keyword=${
      keyword
    }&per_page=${useRuntimeConfig().public.perPage}`;
    if(site_id)
    {
      paramString = paramString+`&site_id=${site_id}`
    }
    const picingList: any = await useAsyncData("childPrices", () =>
      $larafetch(`product/${id}/pricings?${paramString}`)
    );

    const pricing = computed(() => picingList.data.value.data);
    const lastPage = computed(() => picingList.data.value.last_page);

    return {
      pricing,
      lastPage,
      currentPage,
      keyword,
    };
  }
  async function updatePrice(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/pricing`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Product pricing updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let erroString = "";
          for (const [key, value] of Object.entries(errors)) {
            erroString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Update failed", erroString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function getOrderingRules() {
    const list: any = await useAsyncData("orderingRules", () =>
      $larafetch(`/ordering-rule`)
    );
    return list.data;
  }
  async function getPricingRules() {
    const list: any = await useAsyncData("pricingRules", () =>
      $larafetch(`/pricing-rule`)
    );
    return list.data;
  }
  function resetPage() {
    currentPage.value = 1;
  }

  return {
    updatePrice,
    getChildPrices,
    getPrices,
    getOrderingRules,
    getPricingRules,
    resetPage,
    getPrice,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
