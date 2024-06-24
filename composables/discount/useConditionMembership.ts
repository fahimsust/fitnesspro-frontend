export const useConditionMembership = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  const currentPage = ref(1);
  async function addConditionMembership(formData: object) {
    loading.value = true;
    await submitRequest(
      $larafetch("/condition-membership/", { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Membership Level Added successfully`,
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
  async function searchConditionMemberships(
    condition_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${
      currentPage.value
    }&condition_id=${condition_id}&keyword=${keyword}&per_page=${
      useRuntimeConfig().public.perPage
    }`;
    const cacheKey = `membershipCondition-${condition_id}`;
    const membershipList: any = await useAsyncData(cacheKey, () =>
      $larafetch(`/membership-level?${paramString}`)
    );

    const memberships = computed(() => membershipList.data.value.data);
    const lastPage = computed(() => membershipList.data.value.last_page);

    return {
      memberships,
      lastPage,
      currentPage,
    };
  }

  async function membershipLevels() {
    const list: any = await useAsyncData("membershipLevels", () =>
      $larafetch(`/membership-levels`)
    );
    return list.data;
  }
  async function updateConditionMembership(formData: object, id: number) {
    loading.value = true;
    await submitRequest(
      $larafetch(`/condition-membership/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Condition Updated successfully`,
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

  async function deleteConditionMembership(deleteId: number) {
    await useAsyncData("deleteConditionMembership", () =>
      $larafetch(`/condition-membership/${deleteId}`, { method: "delete" })
    );
    swalTopEnd(
      "Deleted Successfully",
      `Membership Level for Condition successfully deleted`,
      "success"
    );
  }
  return {
    addConditionMembership,
    updateConditionMembership,
    deleteConditionMembership,
    searchConditionMemberships,
    membershipLevels,
    errors,
    loading,
  };
};
