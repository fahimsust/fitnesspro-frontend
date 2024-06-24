export const useMessageTemplateCategories = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);

  async function list() {
    const list: any = await useAsyncData("messageTemplateCategories", () =>
      $larafetch(`/message-template-category`)
    );
    return list.data;
  }
  async function deleteMessageTemplateCategory(id: number) {
    try {
      await $larafetch(`/message-template-category/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Message Template Category successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateMessageTemplateCategory(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/message-template-category/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Message Template Category updated successfully`,
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
  }
  async function createMessageTemplateCategory(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/message-template-category/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Message Template Category created successfully`,
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



  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteMessageTemplateCategory,
    createMessageTemplateCategory,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateMessageTemplateCategory
  };
};
