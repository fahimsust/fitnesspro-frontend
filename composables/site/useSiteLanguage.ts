export const useSiteLanguage = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteLanguages(id: number) {
    const list: any = await useAsyncData("siteLanguages", () =>
      $larafetch(`site/${id}/language`)
    );
    return list.data;
  }
  async function updateSiteLanguage(formData: object, id: number, language_id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/language/${language_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Language Rank updated successfully`,
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
    return result.data;
  }
  async function addSiteLanguage(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/language`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Language successfully Added To Site`,
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
  async function deleteSiteLanguage(id: number) {
    try {
      await $larafetch(`/site/${id}/language/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Language successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteLanguages(id);
  }
  async function searchLanguage(site_id: number) {
    let paramString = `site_id=${site_id}`;
    const list: any = await useAsyncData("languages", () =>
      $larafetch(`/language?${paramString}`)
    );
    return list.data;
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getSiteLanguages,
    updateSiteLanguage,
    addSiteLanguage,
    searchLanguage,
    deleteSiteLanguage,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
