export const useAttribute = () => {
    const currentPage = ref(1);
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModal = ref(false);
    const deleteId = ref(0);
  
    async function list(setId:number) {
      const attributeList: any = await useAsyncData("attributes", () =>
        $larafetch(
          `/attributes?set_id=${setId}&page=${currentPage.value}&per_page=${useRuntimeConfig().public.perPage}`
        )
      );
      const attributes = computed(() => attributeList.data.value.data);
      const lastPage = computed(() => attributeList.data.value.last_page);
      return {
        attributes,
        lastPage,
        currentPage,
      };
    }
    async function deleteAttribute(set_id:number) {
      try {
        await $larafetch(`/attribute/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Attribute successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModal.value = false;
      const { attributes } = await list(set_id);
      if (attributes.value.length == 0) {
        if (currentPage.value > 1) {
          currentPage.value = currentPage.value - 1;
          await list(set_id);
        }
      }
    }
    async function updateAttribute(formData: object, id: number) {
      loading.value = true;
      await submitRequest(
        $larafetch(`/attribute/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Attribute updated successfully`,
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
    async function createAttribute(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/attribute/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Attribute created successfully`,
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
    async function updateTranslatedAttribute(formData: object, id: number,language_id:number) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch(`/attribute/${id}/translation/${language_id}`, {
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
    async function getTranslatedAttribute(id: number,language_id:number) {
      const result: any = await useAsyncData("translatedAttribute", () =>
        $larafetch(`/attribute/${id}/translation/${language_id}`)
      );
      return result.data;
    }
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
    function resetPage() {
      currentPage.value = 1;
    }
    async function attributeTypes() {
      const list: any = await useAsyncData("attributeTypes", () =>
        $larafetch(`/attribute-types`)
      );
      return list.data;
    }
    async function attributes(id:number) {
      const list: any = await useAsyncData("attributeList", () =>
        $larafetch(`/attribute?set_id=${id}`)
      );
      return list.data;
    }
  
    return {
      list,
      attributes,
      resetPage,
      deleteAttribute,
      createAttribute,
      errors,
      loading,
      deleteConfirmationModal,
      setDeleteId,
      updateAttribute,
      attributeTypes,
      updateTranslatedAttribute,
      getTranslatedAttribute,
    };
  };