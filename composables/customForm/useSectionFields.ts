export const useSectionFields = () => {
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModalForm = ref(false);
    const archivedId = ref(0);
  
    async function list(sectionId:number) {
      const list: any = await useAsyncData("customFormSections", () =>
        $larafetch(
          `/custom-form-field?section_id=${sectionId}}`
        )
      );
      return list.data;
    }
    async function deleteSectionField(formId:number) {
      try {
        await $larafetch(`/custom-form-field/${archivedId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Custom Form Section Field successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModalForm.value = false;
      //await list(formId);
    }
    async function updateSectionField(formData: object, id: number) {
      loading.value = true;
      await submitRequest(
        $larafetch(`/custom-form-field/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Custom Form Section Field updated successfully`,
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
    async function createSectionField(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/custom-form-field/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Custom Form Section Field created successfully`,
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
    
    function setArchivedId(id: number) {
      archivedId.value = id;
    }
  
    return {
      list,
      deleteConfirmationModalForm,
      deleteSectionField,
      createSectionField,
      errors,
      loading,
      setArchivedId,
      updateSectionField
    };
  };