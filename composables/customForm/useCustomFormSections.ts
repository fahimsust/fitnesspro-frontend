export const useCustomFormSections = () => {
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModal = ref(false);
    const deleteId = ref(0);
  
    async function list(formId:number) {
      const list: any = await useAsyncData("customFormSections", () =>
        $larafetch(
          `/custom-form-section?form_id=${formId}}`
        )
      );
      return list.data;
    }
    async function deleteCustomFormSection(formId:number) {
      try {
        await $larafetch(`/custom-form-section/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Custom Form Section successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModal.value = false;
      await list(formId);
    }
    async function updateCustomFormSection(formData: object, id: number) {
      loading.value = true;
      await submitRequest(
        $larafetch(`/custom-form-section/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Custom Form Section updated successfully`,
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
    async function createCustomFormSection(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/custom-form-section/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Custom Form Section created successfully`,
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


    async function updateTranslatedSection(
      formData: object,
      id: number,
      language_id: number
    ) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch(`/custom-form-section/${id}/translation/${language_id}`, {
          method: "put",
          body: formData,
        }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Custom Form Section Updated successfully`,
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
  
    async function getTranslatedSection(id: number, language_id: number) {
      const result: any = await useAsyncData("translatedSection", () =>
        $larafetch(`/custom-form-section/${id}/translation/${language_id}`)
      );
      return result.data;
    }
    
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
  
    return {
      list,
      deleteCustomFormSection,
      createCustomFormSection,
      errors,
      loading,
      deleteConfirmationModal,
      setDeleteId,
      updateCustomFormSection,
      updateTranslatedSection,
      getTranslatedSection
    };
  };