export const useDiscountCondition = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  let deleteId = 0;
  async function getDiscountConditionOptions() {
    const list: any = await useAsyncData("discount-condition-options", () =>
      $larafetch(`/discount-condition-options`)
    );
    return list.data;
  }
  async function getDiscountCondition(conditionId:number) {
    const list: any = await useAsyncData("discount-condition", () =>
      $larafetch(`/discount-rule-condition/${conditionId}`)
    );
    return list.data;
  }
  async function addDiscountCondition(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/discount-rule-condition/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Discount Condition created successfully`,
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
  }
  async function updateDiscountCondition(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/discount-rule-condition/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Discount Condition updated successfully`,
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

  async function deleteDiscountCondition() {
    await useAsyncData("deleteDiscountCondition", () =>
      $larafetch(`/discount-rule-condition/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Discount Condition successfully archived`,
      "success"
    );
    deleteConfirmationModal.value = false;
  }
  
  function setDeleteId(id: number) {
    deleteId = id;
  }
  return {
    getDiscountConditionOptions,
    getDiscountCondition,
    updateDiscountCondition,
    setDeleteId,
    deleteDiscountCondition,
    addDiscountCondition,
    errors,
    loading,
    deleteConfirmationModal
  };
};
