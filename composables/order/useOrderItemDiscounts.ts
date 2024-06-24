export const useOrderItemDiscounts = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingDiscountOrderItem = ref(false);
  const itemConfirmationModal = ref(false);
  const itemDiscountDeleteId = ref(0);

  async function removeOrderItemDiscount(discount_id:number) {
    try {
      await $larafetch(`/discount/${discount_id}/item/${itemDiscountDeleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Order discount item successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    itemConfirmationModal.value = false;
  }
  
  async function createOrderItemDiscount(discount_id:number,formData:object) {
    loadingDiscountOrderItem.value = true;
    try {
      await submitRequest(
        $larafetch(`/discount/${discount_id}/item/`, { method: "post",body:formData }),
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
        () => (loadingDiscountOrderItem.value = false)
      );
    }
    catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  function setDiscountItemId(id: number) {
    itemDiscountDeleteId.value = id;
  }

  return {
    removeOrderItemDiscount,
    createOrderItemDiscount,
    loadingDiscountOrderItem,
    itemConfirmationModal,
    setDiscountItemId
  };
};
