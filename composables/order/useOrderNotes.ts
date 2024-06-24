export const useOrderNotes = () => {
  const currentPage = ref(1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function getOrderNotes(order_id:number,keyword:any = null) {
    let paramString = `page=${currentPage.value
      }&per_page=${useRuntimeConfig().public.perPage
      }`;
    if(keyword)
    {
      paramString = paramString+"&keyword="+keyword
    }
    const noteList: any = await useAsyncData("orderNotes", () =>
      $larafetch(`/order/${order_id}/note?${paramString}`)
    );

    const notes = computed(() => noteList.data.value.data);
    const lastPage = computed(() => noteList.data.value.last_page);

    return {
      notes,
      lastPage,
      currentPage,
    };
  }
  async function createNote(formData: object,order_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/order/${order_id}/note/`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Note created successfully`,
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
    getOrderNotes,
    createNote,
    errors,
    loading
  };
};
