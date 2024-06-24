export const useDiscountAdvantage = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  let deleteId = 0;
  async function getAdvantages(discountId:number) {
    const list: any = await useAsyncData("discount-advantages", () =>
      $larafetch(`/discount-advantage?discount_id=${discountId}`)
    );
    return list.data;
  }
  async function getAdvantage(advantageId:number) {
    const list: any = await useAsyncData("discount-advantage", () =>
      $larafetch(`/discount-advantage/${advantageId}`)
    );
    return list.data;
  }
  async function getAdvantagesOptions() {
    const list: any = await useAsyncData("advantage-options", () =>
      $larafetch(`/advantage-options`)
    );
    return list.data;
  }
  async function addAdvantage(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/discount-advantage/", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Discount Advantage created successfully`,
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
  async function updateAdvantage(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/discount-advantage/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Advantage details updated successfully`,
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

  async function deleteAdvantage(discountId:number) {
    await useAsyncData("deleteAdvantage", () =>
      $larafetch(`/discount-advantage/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Discount Advantage successfully archived`,
      "success"
    );
    deleteConfirmationModal.value = false;
    await getAdvantages(discountId);
  }
  
  function setDeleteId(id: number) {
    deleteId = id;
  }
  return {
    getAdvantages,
    getAdvantage,
    getAdvantagesOptions,
    updateAdvantage,
    setDeleteId,
    deleteAdvantage,
    addAdvantage,
    errors,
    loading,
    deleteConfirmationModal
  };
};
