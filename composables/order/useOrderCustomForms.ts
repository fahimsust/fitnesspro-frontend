export const useOrderCustomForms = () => {
  const currentPage = ref(1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function getOrderCustomForms(order_id: number) {
    let paramString = `page=${currentPage.value
      }&per_page=${useRuntimeConfig().public.perPage
      }`;
    const customFormList: any = await useAsyncData("getOrderCustomForms", () =>
      $larafetch(`/order/${order_id}/custom-forms/?${paramString}`)
    );

    const customForms = computed(() => customFormList.data.value.data);
    const lastPage = computed(() => customFormList.data.value.last_page);

    return {
      customForms,
      lastPage,
      currentPage,
    };
  }
  async function updateOrderCustomForm(formData: object, order_id: number, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/order/${order_id}/custom-forms/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Update",
          `Custom form successfully updated`,
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
          swalTopEnd("Update failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
  }
  return {
    getOrderCustomForms,
    loading,
    errors,
    updateOrderCustomForm
  };
};
