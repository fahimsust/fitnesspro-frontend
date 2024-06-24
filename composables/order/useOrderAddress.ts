export const useOrderAddress = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingAddress = ref(false);

  async function assignAddress(formData:any,order_id:number) {
    loadingAddress.value = true;
    const result: any = await submitRequest(
      $larafetch(`/order/${order_id}/address`, { method: "post", body:formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Assigned Successfully",
          `Address assign to the order`,
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
          swalTopEnd("Assigned failed", errorString, "error");
        }
      },
      () => (loadingAddress.value = false)
    );
    return result.data;
  }

  return {
    assignAddress,
    loadingAddress,
    errors
  };
};
