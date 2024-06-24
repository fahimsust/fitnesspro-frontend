export const useCustomerSpecialty = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function accountSpecialties(account_id: number) {
    let paramString = `account_id=${account_id}`;

    const accountSpecialties: any = await useAsyncData("accountSpecialties", () =>
      $larafetch(`/account-specialty?${paramString}`)
    );
    return accountSpecialties.data;
  }
  async function deleteSpecialty(id: number) {
    try {
      await $larafetch(`/account-specialty/${id}`, {
        method: "delete",
      })
    } catch (error: any) {
      swalTopEnd(
        "",
        error.data?.message,
        "error",
        3000
      );
    }
  }
  async function addSpecialty(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-specialty/`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Failed", `Something Went Wrong`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  return {
    addSpecialty,
    deleteSpecialty,
    accountSpecialties,
    loading,
    errors
  };
};
