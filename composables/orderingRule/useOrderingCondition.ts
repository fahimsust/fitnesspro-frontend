export const useOrderingCondition = () => {
  const currentPage = ref(1);
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);

  async function list(ruleId: number) {
    const list: any = await useAsyncData("conditions", () =>
      $larafetch(`/ordering-rule/${ruleId}/conditions`)
    );
    return list.data;
  }
  async function deleteCondition(ruleId: number) {
    try {
      await $larafetch(`/ordering-condition/${deleteId.value}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Condition successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    await list(ruleId);
  }
  async function updateCondition(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/ordering-condition/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Condition updated successfully`,
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
  async function createCondition(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/ordering-condition/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Condition created successfully`,
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
    list,
    deleteCondition,
    createCondition,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
    updateCondition,
  };
};
