export const useSiteOfflineOnline = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function offlineSetting(id: number) {
    const result: any = await useAsyncData("offlineSetting", () =>
      $larafetch(`/site/${id}/offline-settings`)
    );
    return result.data;
  }

  async function updateOfflineSetting(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/offline-settings`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Site offline setting updated successfully`,
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
  async function online(id: number) {
    loading.value = true;
    try {
      await useAsyncData("siteOnline", () =>
        $larafetch(`/site/${id}/online`, {
          method: "post",
        })
      );
      swalTopEnd("", `Site is now online`, "success");
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    loading.value = false;
  }
  async function offline(id: number) {
    loading.value = true;
    try {
      await useAsyncData("siteOffline", () =>
        $larafetch(`/site/${id}/offline`, {
          method: "delete",
        })
      );
      swalTopEnd("", `Site is now offline`, "success");
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    loading.value = false;
  }
  async function updateTranslatedOfflineMessage(
    formData: object,
    id: number,
    language_id: number
  ) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/site/${id}/translation-offline/${language_id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Offline message updated successfully`,
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

  return {
    offlineSetting,
    updateOfflineSetting,
    updateTranslatedOfflineMessage,
    online,
    offline,
    errors,
    loading,
  };
};
