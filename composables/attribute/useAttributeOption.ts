export const useAttributeOption = () => {
  const currentPage = ref(1);
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModal = ref(false);
    const deleteId = ref(0);
  
    async function list(attributeId:number) {
      const attributeOptionList: any = await useAsyncData("attributeOptions", () =>
        $larafetch(
          `/attribute-options?attribute_id=${attributeId}&page=${currentPage.value}&per_page=${useRuntimeConfig().public.perPage}`
        )
      );
      const attributeOptions = computed(() => attributeOptionList.data.value.data);
      const lastPage = computed(() => attributeOptionList.data.value.last_page);
      return {
        attributeOptions,
        lastPage,
        currentPage,
      };
    }
    async function deleteAttributeOption(attributeId:number) {
      try {
        await $larafetch(`/attribute-option/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Attribute Option successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModal.value = false;
      const { attributeOptions } = await list(attributeId);
      if (attributeOptions.value.length == 0) {
        if (currentPage.value > 1) {
          currentPage.value = currentPage.value - 1;
          await list(attributeId);
        }
      }
    }
    async function updateAttributeOption(formData: object, id: number) {
      loading.value = true;
      await submitRequest(
        $larafetch(`/attribute-option/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Attribute Option updated successfully`,
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
    async function createAttributeOption(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/attribute-option/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Attribute Option created successfully`,
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
    async function updateTranslatedAttributeOption(formData: object, id: number,language_id:number) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch(`/attribute-option/${id}/translation/${language_id}`, {
          method: "put",
          body: formData,
        }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd("Updated Successfully", `Translation Updated successfully`, "success");
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
    async function getTranslatedAttributeOption(id: number,language_id:number) {
      const result: any = await useAsyncData("translatedOption", () =>
        $larafetch(`/attribute-option/${id}/translation/${language_id}`)
      );
      return result.data;
    }
    async function attributeOption(id:number) {
      const list: any = await useAsyncData("attributeOptionList", () =>
        $larafetch(`/attribute-option?attribute_id=${id}`)
      );
      return list.data;
    }
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
  
    return {
      list,
      deleteAttributeOption,
      createAttributeOption,
      errors,
      loading,
      deleteConfirmationModal,
      setDeleteId,
      attributeOption,
      updateAttributeOption,
      getTranslatedAttributeOption,
      updateTranslatedAttributeOption
    };
  };