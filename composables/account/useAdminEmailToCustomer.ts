export const useAdminEmailToCustomer = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  async function adminEmails(account_id: number) {
    let paramString = `account_id=${account_id}`;
    const adminEmails: any = await useAsyncData("adminEmails", () =>
      $larafetch(`/contact-customer?${paramString}`)
    );
    return adminEmails.data;
  }
  async function createAdminEmails(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/contact-customer/`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Email Sent",
          `Email successfully sent to customer`,
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
    adminEmails,
    createAdminEmails,
    loading,
    errors
  };
};
