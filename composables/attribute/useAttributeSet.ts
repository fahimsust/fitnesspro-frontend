export const useAttributeSet = () => {
    const route = useRoute();
    const page = route.query.page;
    const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModal = ref(false);
    const deleteId = ref(0);
    const order_by = route.query.order_by;
    const order_type = route.query.order_type;
    const orderBy = ref(typeof order_by == "string" ? order_by : "");
    const orderType = ref(typeof order_type == "string" ? order_type : "");
  
    async function list() {
      const attributeSetList: any = await useAsyncData("attributeSets", () =>
        $larafetch(
          `/attribute-sets?page=${currentPage.value}&order_by=${
            orderBy.value
          }&order_type=${
            orderType.value
          }&per_page=${useRuntimeConfig().public.perPage}`
        )
      );
      const attributeSets = computed(() => attributeSetList.data.value.data);
      const lastPage = computed(() => attributeSetList.data.value.last_page);
      return {
        attributeSets,
        lastPage,
        currentPage,
        orderBy,
        orderType
      };
    }
    async function deleteAttributeSet(id: number) {
      try {
        await $larafetch(`/attribute-set/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Attribute set successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModal.value = false;
      const { attributeSets } = await list();
      if (attributeSets.value.length == 0) {
        if (currentPage.value > 1) {
          createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
          currentPage.value = currentPage.value - 1;
          await list();
        }
      }
    }
    async function updateAttributeSet(formData: object, id: number) {
      loading.value = true;
      await submitRequest(
        $larafetch(`/attribute-set/${id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Attribute set updated successfully`,
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
    async function createAttributeSet(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/attribute-set/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Attribute set created successfully`,
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
    async function updateTranslatedAttributeSet(formData: object, id: number,language_id:number) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch(`/attribute-set/${id}/translation/${language_id}`, {
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
    async function getTranslatedAttributeSet(id: number,language_id:number) {
      const result: any = await useAsyncData("translatedSet", () =>
        $larafetch(`/attribute-set/${id}/translation/${language_id}`)
      );
      return result.data;
    }
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
  
    return {
      list,
      deleteAttributeSet,
      createAttributeSet,
      errors,
      loading,
      deleteConfirmationModal,
      setDeleteId,
      updateAttributeSet,
      updateTranslatedAttributeSet,
      getTranslatedAttributeSet
    };
  };