export const useOrderDiscounts = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingDiscountOrder = ref(false);
  const discountConfirmationModal = ref(false);
  const orderDiscountDeleteId = ref(0);
  const currentPage = ref(1);

  async function discountList(keywordString = "",order_id = 0) {
    const discountList: any = await useAsyncData(
      "discounts",
      () =>
        $larafetch(
          `/discount?page=${currentPage.value}&keyword=${
            keywordString
          }&order_id=${
            order_id
          }&status=1&per_page=${
            useRuntimeConfig().public.perPage
          }`
        ),
      { watch: [currentPage] }
    );

    const discounts = computed(() => discountList.data.value.data);
    const lastPage = computed(() => discountList.data.value.last_page);

    return {
      discounts,
      lastPage,
      currentPage
    };
  }

  async function removeOrderDiscount(order_id:number) {
    try {
      await $larafetch(`/order/${order_id}/discount/${orderDiscountDeleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Order discount successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    discountConfirmationModal.value = false;
  }
  
  async function createOrderDiscount(order_id:number,formData:object) {
    loadingDiscountOrder.value = true;
    try {
      await submitRequest(
        $larafetch(`/order/${order_id}/discount/`, { method: "post" , body:formData}),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Successfully Added",
            `Discount added successfully`,
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
            swalTopEnd("failed", errorString, "error");
          }
        },
        () => (loadingDiscountOrder.value = false)
      );
    }
    catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  function setDiscountOrderId(id: number) {
    orderDiscountDeleteId.value = id;
  }

  return {
    removeOrderDiscount,
    createOrderDiscount,
    loadingDiscountOrder,
    discountConfirmationModal,
    setDiscountOrderId,
    discountList
  };
};
