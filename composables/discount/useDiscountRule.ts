export const useDiscountRule = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  let dLoading = ref(false);
  const deleteConfirmationModal = ref(false);
  let deleteId = 0;
  async function getDiscountRules(discountId:number) {
    const list: any = await useAsyncData("discount-rules", () =>
      $larafetch(`/discount-rule?discount_id=${discountId}`)
    );
    return list.data;
  }
  async function getDiscountRule(ruleId:number) {
    const list: any = await useAsyncData("discount-rule", () =>
      $larafetch(`/discount-rule/${ruleId}`)
    );
    return list.data;
  }
  async function addDiscountRule(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/discount-rule/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Discount Rule created successfully`,
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

  async function updateDiscountRuleMatch(formData: object, id: number) {
    dLoading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/discount-match-rule/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Discount Rule Match updated successfully`,
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
      () => (dLoading.value = false)
    );
    return result.data;
  }
  async function updateDiscountRule(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/discount-rule/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Discount Rule updated successfully`,
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

  async function deleteDiscountRule() {
    await useAsyncData("deleteDiscountRule", () =>
      $larafetch(`/discount-rule/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Discount Rule successfully deleted`,
      "success"
    );
    deleteConfirmationModal.value = false;
  }
  
  function setDeleteId(id: number) {
    deleteId = id;
  }
  return {
    getDiscountRules,
    getDiscountRule,
    updateDiscountRule,
    setDeleteId,
    deleteDiscountRule,
    addDiscountRule,
    updateDiscountRuleMatch,
    errors,
    loading,
    dLoading,
    deleteConfirmationModal
  };
};
