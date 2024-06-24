export const useDefaultAccountType = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function updateSiteDefaultAccountType(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/default-account-type`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site default account type updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Update failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  return {
    updateSiteDefaultAccountType,
    errors,
    loading,
  };
};
