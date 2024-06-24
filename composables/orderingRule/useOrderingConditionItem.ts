export const useOrderingConditionItem = () => {
  const errorsItem: { [key: string]: any } = reactive({});
  let loadingItem = ref(false);

  async function deleteConditionItem(conditionId: number,deleteId:number) {
    try {
      await $larafetch(
        `/ordering-condition/${conditionId}/item/${deleteId}`,
        { method: "delete" }
      );
      swalTopEnd(
        "Deleted Successfully",
        `Condition Item successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  async function createConditionItem(conditionId: number, formData: object) {
    loadingItem.value = true;
    const result: any = await submitRequest(
      $larafetch(`/ordering-condition/${conditionId}/item`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errorsItem);
        swalTopEnd(
          "Created Successfully",
          `Condition Item created successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errorsItem);
          addValidationErrors(errorsItem, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loadingItem.value = false)
    );
    return result.data;
  }

  return {
    deleteConditionItem,
    createConditionItem,
    errorsItem,
    loadingItem,
  };
};
