export const useLayouts = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function list() {
    const layoutList: any = await useAsyncData("layouts", () =>
      $larafetch(`/layout/`)
    );
     return  layoutList.data
  }
  async function deleteLayout() {
    try {
      await $larafetch(`/layout/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Layout successfully deleted`,
        "success"
      );
      await list();
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateLayout(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/layout/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Layout Updated successfully`,
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
  
  
  async function addLayout(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/layout`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Layout Added successfully`,
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
  async function getLayout(id: number) {
    const result: any = await useAsyncData("layout", () =>
      $larafetch(`/layout/${id}`)
    );
    return result.data;
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    list,
    getLayout,
    updateLayout,
    addLayout,
    deleteLayout,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
