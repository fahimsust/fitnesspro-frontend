export const useOrderingRuleChild = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const deleteConfirmationModal = ref(false);
  const deleteId = ref(0);

  async function list(ruleId: number) {
    const list: any = await useAsyncData("childRules", () =>
      $larafetch(`ordering-rule-childs/${ruleId}`)
    );
    return list.data;
  }
  async function deleteChild(ruleId: number) {
    try {
      await $larafetch(`ordering-rule/${ruleId}/child/${deleteId.value}/`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Child Rule successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
    await list(ruleId);
  }

  async function createChild(formData: object, ruleId: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`ordering-rule/${ruleId}/child/`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Child Rule created successfully`,
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
  async function searchChildRules(rule_id: number, keword: string = "") {
    const list: any = await useAsyncData("featuredProducts", () =>
      $larafetch(`/ordering-rule/${rule_id}/children?keyword=${keword}`)
    );
    return list.data;
  }

  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    list,
    deleteChild,
    createChild,
    searchChildRules,
    errors,
    loading,
    deleteConfirmationModal,
    setDeleteId,
  };
};
