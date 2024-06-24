export const useOrderAffiliate = () => {
  const currentPage = ref(1);
  const errors: { [key: string]: any } = reactive({});
  const affiliateConfirmationModal = ref(false);
  let loading = ref(false);
  async function getOrderAffiliate(order_id:number) {
    let paramString = `page=${currentPage.value
      }&per_page=${useRuntimeConfig().public.perPage
      }`;
    const affiliateList: any = await useAsyncData("orderNotes", () =>
      $larafetch(`/order/${order_id}/affiliate?${paramString}`)
    );

    const affiliates = computed(() => affiliateList.data.value.data);
    const lastPage = computed(() => affiliateList.data.value.last_page);

    return {
      affiliates,
      lastPage,
      currentPage,
    };
  }
  async function removeOrderAffiliate(order_id:number) {
    loading.value = true;
    try {
      await submitRequest(
        $larafetch(`/order/${order_id}/remove-affiliate/`, { method: "post" }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Unassigned Successfully",
            `Affiliate unassigned successfully`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    affiliateConfirmationModal.value = false;
  }
  async function createOrderAffiliate(formData: object,order_id:number) {
    loading.value = true;
    try {
      await submitRequest(
        $larafetch(`/order/${order_id}/affiliate/`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Affiliate created successfully`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }

  return {
    getOrderAffiliate,
    createOrderAffiliate,
    removeOrderAffiliate,
    affiliateConfirmationModal,
    errors,
    loading
  };
};
