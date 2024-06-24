export const useCustomerAddress = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const deleteConfirmationModal = ref(false);

  async function addressList(account_id: number, hideDeleted: boolean) {
    let paramString = `account_id=${account_id}`;
    if (!hideDeleted) {
      paramString += `&status=-1`
    }
    const accountAddress: any = await useAsyncData("addressList", () =>
      $larafetch(`/account-address?${paramString}`)
    );
    return accountAddress.data;
  }
  async function createAccountAddress(formData: any, id: number) {
    loading.value = true;
    formData.account_id = id
    const result: any = await submitRequest(
      $larafetch(`/account-address`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Added",
          `Account Address added successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Add failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function updateAccountAddress(formData: object, id: number, showValidationError: boolean = false) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-address/${id}`, { method: "put", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Account Address updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = 'Please solve the errors';
          if (showValidationError) {
            for (const [_, value] of Object.entries(errors)) {
              errorString = "<span class='text-red-600'>" + value + "</span>";
              break;
            }
          }
          swalTopEnd("Update failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteAccountAddress(id: any, account_id: number, hideDeleted: boolean) {
    try {
      await $larafetch(`/account-address/${id}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Account address successfully deleted`,
        "success"
      );
      await addressList(account_id, hideDeleted)
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  async function retrieveAccountAddress(id: any, account_id: number, hideDeleted: boolean) {
    try {
      await $larafetch(`/account-address/${id}`, { method: "delete" });
      swalTopEnd(
        "Retrieve Successfully",
        `Account address successfully retrieve`,
        "success"
      );
      await addressList(account_id, hideDeleted)
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  return {
    addressList,
    updateAccountAddress,
    createAccountAddress,
    deleteAccountAddress,
    retrieveAccountAddress,
    errors,
    loading
  };
};
