export const useSiteCurrency = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteCurrencies(id: number) {
    const list: any = await useAsyncData("siteCurrencies", () =>
      $larafetch(`site/${id}/currency`)
    );
    return list.data;
  }
  async function updateSiteCurrency(formData: object, id: number,currency_id:number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/currency/${currency_id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Currency Rank updated successfully`,
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
  async function addSiteCurrency(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/currency`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Currency successfully Added To Site`,
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
  async function deleteSiteCurrency(id: number) {
    try {
      await $larafetch(`/site/${id}/currency/${archiveId}`, {
        method: "delete",
      });
      swalTopEnd(
        "Deleted Successfully",
        `Currency successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteCurrencies(id);
  }
  async function searchCurrency(site_id: number) {
    let paramString = `site_id=${site_id}`;
    const list: any = await useAsyncData("currencies", () =>
      $larafetch(`/currency?${paramString}`)
    );
    return list.data;
  }
  async function baseCurrency(id:number) {
    const currency: any = await useAsyncData(
        'baseCurrency',
        () => $larafetchfront(`/currency/${id}/base`),
    )
    return currency.data;
}
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getSiteCurrencies,
    updateSiteCurrency,
    addSiteCurrency,
    searchCurrency,
    deleteSiteCurrency,
    baseCurrency,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
