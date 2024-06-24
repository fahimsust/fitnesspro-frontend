export const useOrderEmails = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingEmail = ref(false);
  const currentPage = ref(1);
  async function getOrderEmails(order_id: number,keyword:any = null) {
    let paramString = `page=${currentPage.value}&per_page=${useRuntimeConfig().public.perPage}`;
    
    const emailList: any = await useAsyncData("getOrderEmails", () =>
      $larafetch(`/order/${order_id}/email?${paramString}`)
    );
    const emails = computed(() => emailList.data.value.data);
    const lastPage = computed(() => emailList.data.value.last_page);
    return {
      emails,
      lastPage,
      currentPage,
    };
  }

  async function sentEmail(order_id: number) {
    loadingEmail.value = true;
    try {
      await submitRequest(
        $larafetch(`/order/${order_id}/send-mail/`, { method: "post" }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Email Send",
            `Order email send successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Send failed", `Please solve the errors`, "error");
          }
        },
        () => (loadingEmail.value = false)
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }

  return {
    getOrderEmails,
    sentEmail,
    loadingEmail
  };
};
