export const useCustomerFiles = () => {
  let fileId = 0
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const deleteConfirmationModal = ref(false);
  async function accountFileList(account_id: number) {
    let paramString = `account_id=${account_id}`;
    const accountFileList: any = await useAsyncData("accountFileList", () =>
      $larafetch(`/account-file?${paramString}`)
    );
    return accountFileList.data;
  }
  async function uploadFile(value: any, account_id: number) {
    const formData = new FormData();
    formData.append('filename', value);
    formData.append('account_id', account_id.toString());
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-file`, { method: "post", body: formData }, true),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully uploaded",
          `Account file uploaded successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let errorString = "";
          for (const [_, value] of Object.entries(errors)) {
            errorString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("Update failed", errorString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteFile() {
    try {
      await $larafetch(`/account-file/${fileId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `File successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  function setDeleteId(id: number) {
    fileId = id;
  }
  return {
    accountFileList,
    deleteConfirmationModal,
    deleteFile,
    uploadFile,
    setDeleteId
  };
};
