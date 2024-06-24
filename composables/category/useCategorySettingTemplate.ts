export const useCategorySettingTemplate = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function list() {
    const settingList: any = await useAsyncData("categorySettingsTemplate", () =>
      $larafetch(`/category-settings-template/`)
    );
     return  settingList.data
  }
  async function deleteSettingTemplate() {
    try {
      await $larafetch(`/category-settings-template/${archiveId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Setting template successfully deleted`,
        "success"
      );
      await list();
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateSettingTemplate(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category-settings-template/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Setting template Updated successfully`,
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
  
  
  async function addSettingTemplate(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/category-settings-template`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Added Successfully",
          `Setting template  Added successfully`,
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
  async function getSettingTemplate(id:number) {
    const settingList: any = await useAsyncData("getSettingTemplate", () =>
      $larafetch(`/category-settings-template/${id}`)
    );
     return  settingList.data
  }

  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    list,
    updateSettingTemplate,
    addSettingTemplate,
    deleteSettingTemplate,
    getSettingTemplate,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
