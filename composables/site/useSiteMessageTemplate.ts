export const useSiteMessageTemplate = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getMessageTemplate(id: number) {
    const result: any = await useAsyncData("messageTemplate", () =>
      $larafetch(`site/${id}/message-template`)
    );
    return result.data;
  }
  async function updateMessageTemplate(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/message-template`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Message template updated successfully`,
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
    getMessageTemplate,
    updateMessageTemplate,
    errors,
    loading,
  };
};
