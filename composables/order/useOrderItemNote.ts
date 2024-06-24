export const useOrderItemNote = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  
  async function createNote(formData: object,order_item_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/order-item/${order_item_id}/note/`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Order item note updated`,
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
    return result.data;
  }

  return {
    createNote,
    errors,
    loading
  };
};
