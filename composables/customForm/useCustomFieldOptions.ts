export const useCustomFieldOptions = () => {
    const errorsOption: { [key: string]: any } = reactive({});
    let loadingOption = ref(false);
    const deleteConfirmationModalOption = ref(false);
    const deleteId = ref(0);
  
    async function optionList(fieldId:number) {
      const list: any = await useAsyncData("customFieldOptions", () =>
        $larafetch(
          `/custom-field-option?field_id=${fieldId}}`
        )
      );
      return list.data;
    }
    async function deleteCustomFieldOption(fieldId:number) {
      try {
        await $larafetch(`/custom-field-option/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Option successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModalOption.value = false;
      await optionList(fieldId);
    }
    async function updateCustomFieldOption(formData: object, id: number) {
      loadingOption.value = true;
      await submitRequest(
        $larafetch(`/custom-field-option/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errorsOption);
          swalTopEnd(
            "Updated Successfully",
            `Option updated successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errorsOption);
            addValidationErrors(errorsOption, validationErrors);
            swalTopEnd("Update failed", `Please solve the errors`, "error");
          }
        },
        () => (loadingOption.value = false)
      );
    }
    async function createCustomFieldOption(formData: object) {
      loadingOption.value = true;
      const result: any = await submitRequest(
        $larafetch("/custom-field-option/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errorsOption);
          swalTopEnd(
            "Created Successfully",
            `Option created successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errorsOption);
            addValidationErrors(errorsOption, validationErrors);
            swalTopEnd("Create failed", `Please solve the errors`, "error");
          }
        },
        () => (loadingOption.value = false)
      );
      return result.data;
    }
    
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
  
    return {
      optionList,
      deleteCustomFieldOption,
      createCustomFieldOption,
      errorsOption,
      loadingOption,
      deleteConfirmationModalOption,
      setDeleteId,
      updateCustomFieldOption
    };
  };