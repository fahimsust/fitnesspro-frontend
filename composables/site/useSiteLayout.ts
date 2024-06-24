export const useSiteLayout = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function updateLayout(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/default-layout`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Layout updated successfully`,
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
    updateLayout,
    errors,
    loading,
  };
};
