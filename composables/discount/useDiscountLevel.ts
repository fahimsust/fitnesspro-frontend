export const useDiscountLevel = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function discountLevels() {
    const list: any = await useAsyncData("discountLevels", () =>
      $larafetch(`/discount-level`)
    );
    return list.data;
  }
  async function discountLevelApplyTo() {
    const list: any = await useAsyncData("discountLevelApplyTo", () =>
      $larafetch(`/discount-level-apply-to`)
    );
    return list.data;
  }
  async function discountLevelActionType() {
    const list: any = await useAsyncData("discountLevelActionType", () =>
      $larafetch(`/discount-level-action-type`)
    );
    return list.data;
  }

  async function updateDiscountLevel(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/discount-level/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Discount level details updated successfully`,
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
  async function createDiscountLevel(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch("/discount-level/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Discount level created successfully`,
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
  async function getDiscountLevel(id: number) {
    const result: any = await useAsyncData("discountLevel", () =>
      $larafetch(`/discount-level/${id}`)
    );
    return result.data;
  }
  async function statusChange(formData: object, id: number) {
    await useAsyncData("statusChange", () =>
      $larafetch(`/discount-level/${id}/status`, { method: "post", body: formData })
    );
    swalTopEnd("Status Change", `Discount Level Status Change`, "success");
    await discountLevels();
  }
  return {
    discountLevels,
    updateDiscountLevel,
    createDiscountLevel,
    statusChange,
    getDiscountLevel,
    discountLevelApplyTo,
    discountLevelActionType,
    errors,
    loading,
  };
};
