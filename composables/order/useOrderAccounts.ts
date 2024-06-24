export const useOrderAccounts = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingAccount = ref(false);
  const accountConfirmationModal = ref(false);
  const deleteId = ref(0);
  const currentPage = ref(1);

  async function unAssignAccount(order_id:number) {
    try {
      await $larafetch(`/order/${order_id}/account/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Removed Successfully",
        `Account successfully removed`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    accountConfirmationModal.value = false;
  }
  async function assignAccount(id: number,order_id:number) {
    loadingAccount.value = true;
    const result: any = await submitRequest(
      $larafetch(`/order/${order_id}/account/${id}`, { method: "put" }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Assigned Successfully",
          `Account successfully assign to the order`,
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
      () => (loadingAccount.value = false)
    );
    return result.data;
  }
  async function searchOrderAccount(
    keyword: string = ""
  ) {
    let paramString = `page=${currentPage.value
      }&keyword=${keyword}&per_page=${useRuntimeConfig().public.perPage
      }`;
    const accountList: any = await useAsyncData("searchOrderAccount", () =>
      $larafetch(`/accounts?${paramString}`)
    );

    const accounts = computed(() => accountList.data.value.data);
    const lastPage = computed(() => accountList.data.value.last_page);

    return {
      accounts,
      lastPage,
      currentPage,
    };
  }
  function setAccountId(id: number) {
    deleteId.value = id;
  }

  return {
    loadingAccount,
    accountConfirmationModal,
    unAssignAccount,
    searchOrderAccount,
    assignAccount,
    setAccountId
  };
};
