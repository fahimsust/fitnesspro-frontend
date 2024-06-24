export const useModuleTemplateSections = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false)
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);
  async function sections(template_id: number) {
    const list: any = await useAsyncData("moduleTemplateSections", () =>
      $larafetch(`/module-template-section?template_id=${template_id}`)
    );
    return list.data;
  }
  async function deleteModuleSectionTemplate() {
    try {
      await $larafetch(`/module-template-section/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Module Template Section successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }

  async function createModuleTemplateSection(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/module-template-section/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Module Template Section created successfully`,
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
    sections,
    deleteModuleSectionTemplate,
    createModuleTemplateSection,
    deleteConfirmationModal,
    setDeleteId,
    errors,
    loading
  };
};
