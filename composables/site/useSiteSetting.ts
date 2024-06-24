export const useSiteSetting = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteSetting(id:number) {
    const result: any = await useAsyncData("siteSettings", () =>
      $larafetch(`/site/${id}/settings`)
    );
    return result.data;
  }
 
  async function updateSiteSetting(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/settings`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site setting updated successfully`,
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
    getSiteSetting,
    updateSiteSetting,
    errors,
    loading,
  };
};
