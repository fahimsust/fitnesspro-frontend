export const useSiteInventoryRule = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteRules(id: number) {
    const list: any = await useAsyncData("siteRules", () =>
      $larafetch(`site/${id}/inventory-rule`)
    );
    return list.data;
  }
  async function addSiteRule(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/inventory-rule`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Rule successfully added To Site`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 5000);
    }
    return result.data;
  }
  async function deleteSiteRule(id: number) {
    try {
      await $larafetch(`/site/${id}/inventory-rule/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Rule successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteRules(id);
  }
  async function searchRule(site_id: number) {
    let paramString = `site_id=${site_id}`;
    const list: any = await useAsyncData("rules", () =>
      $larafetch(`/inventory-rule?${paramString}`)
    );
    return list.data;
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getSiteRules,
    searchRule,
    deleteSiteRule,
    addSiteRule,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
