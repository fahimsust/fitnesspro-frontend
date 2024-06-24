export const useModuleTemplateModules = () => {
  const errorModule: { [key: string]: any } = reactive({});
  const loadingModule = ref(false)
  const selectedId = ref(0)
  async function Modules(template_id: number) {
    const list: any = await useAsyncData("moduleTemplateModules", () =>
      $larafetch(`/module-template-module?template_id=${template_id}`)
    );
    return list.data;
  }
  async function deleteModuleTemplateModule(deleteId: number) {
    try {
      await $larafetch(`/module-template-module/${deleteId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Module successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }

  async function updateModuleTemplateModule(formData: object, id: number) {
    await submitRequest(
      $larafetch(`/module-template-module/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errorModule);
        swalTopEnd(
          "",
          `Rank Saved`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errorModule);
          addValidationErrors(errorModule, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errorModule)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Saved failed", errorString, "error");
        }
      },
      () => (() => { })
    );
  }

  async function createModuleTemplateModule(formData: any) {
    loadingModule.value = true
    selectedId.value = formData.section_id
    const result: any = await submitRequest(
      $larafetch("/module-template-module/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errorModule);
        swalTopEnd(
          "Created Successfully",
          `Module created successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errorModule);
          addValidationErrors(errorModule, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => loadingModule.value = false
    );
    return result.data;
  }

  return {
    Modules,
    deleteModuleTemplateModule,
    createModuleTemplateModule,
    updateModuleTemplateModule,
    errorModule,
    selectedId,
    loadingModule
  };
};
