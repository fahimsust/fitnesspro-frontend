export const useCategoryRuleCondition = () => {
  const deleteConfirmationModalC = ref(false);
  let archiveIdC = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getCategoryRuleConditions(id: number) {
    const list: any = await useAsyncData("categoryRuleConditions", () =>
      $larafetch(`category-rule/${id}/condition`)
    );
    return list.data;
  }
  async function addCategoryRuleCondition(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category-rule/${id}/condition`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Condition successfully Added to category rule`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        5000,
      );
    }
    return result.data;
  }
  async function deleteCategoryRuleCondition(id: number) {
    try{
      await $larafetch(`/category-rule/${id}/condition/${archiveIdC}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Condition successfully removed from category rule`,
        "success"
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        3000
      );
    }  
    deleteConfirmationModalC.value = false;
    await getCategoryRuleConditions(id);
  }
  async function updateCategoryRuleCondition(formData: object, id: number, rule_id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/category-rule/${id}/condition/${rule_id}`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Category Rule Condition Updated successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
    }
    catch(error:any)
    {
      swalTopEnd(
        "", 
        error.data?.message,
        "error",
        5000,
      );
    }
    return result.data;
  }
  function setArchiveIdC(id: number) {
    archiveIdC = id;
  }

  return {
    setArchiveIdC,
    getCategoryRuleConditions,
    addCategoryRuleCondition,
    deleteCategoryRuleCondition,
    updateCategoryRuleCondition,
    errors,
    loading,
    deleteConfirmationModalC,
  };
};
