export const useCustomerMembership = () => {
  const deleteConfirmationModal = ref(false);
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  let cancelId = 0;
  
  async function memberShipList(account_id:number) {
    let paramString = `account_id=${account_id}`;

    const accountMemberships: any = await useAsyncData("memberShipList", () =>
      $larafetch(`/account-membership?${paramString}`)
    );
    return accountMemberships.data;
  }
  async function activeMemberShip(account_id:number) {
    const accountMembership: any = await useAsyncData("activeMemberShip", () =>
      $larafetch(`/account-membership/${account_id}`)
    );
    return accountMembership.data;
  }
  async function cancelMembership() {
    try {
        await $larafetch(`/account-membership/${cancelId}`, {
            method: "delete",
        })
        swalTopEnd(
            "Cancel Successfully",
            `Membership successfully cancelled`,
            "success"
        );
    } catch (error: any) {
        swalTopEnd(
            "",
            error.data?.message,
            "error",
            3000
        );
    }
    deleteConfirmationModal.value = false;
}
function setCancelId(id: number) {
  cancelId = id;
}
  async function createAccountMembership(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-membership/`, { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Membership created successfully`,
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
    activeMemberShip,
    createAccountMembership,
    memberShipList,
    deleteConfirmationModal,
    cancelMembership,
    setCancelId,
    loading,
    errors
  };
};
