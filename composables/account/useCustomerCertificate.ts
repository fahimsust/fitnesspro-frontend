export const useCustomerCertificate = () => {
  let certificateId = 0
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const deleteConfirmationModal = ref(false);
  async function accountCertificateList(account_id: number) {
    let paramString = `account_id=${account_id}`;
    const accountCertificateList: any = await useAsyncData("accountCertificateList", () =>
      $larafetch(`/account-certification?${paramString}`)
    );
    return accountCertificateList.data;
  }
  async function updateCertificate(formDataMain: object, file_name: any = null, id: number) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(formDataMain)) {
      if (value !== null) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value);
        }
      }
    }
    formData.append('_method', 'PUT');
    if (file_name) {
      formData.append('file_name', file_name);
    }
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-certification/${id}`, { method: "post", body: formData }, true),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Account Certificate updated successfully`,
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
  async function uploadCertificate(formDataMain: object, file_name: any = null) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(formDataMain)) {
      if (value !== null) {
        if (typeof value === 'boolean') {
          // Convert boolean to integer (1 or 0)
          formData.append(key, value ? '1' : '0');
        } else if (value instanceof Date) {
          // Convert date to string
          formData.append(key, value.toISOString());
        } else {
          // Append other types as is
          formData.append(key, value);
        }
      }
    }
    if (file_name) {
      formData.append('file_name', file_name);
    }
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/account-certification`, { method: "post", body: formData }, true),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully added",
          `Account certificate added successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Upload failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteCertificate() {
    try {
      await $larafetch(`/account-certification/${certificateId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Certificate successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  function setDeleteId(id: number) {
    certificateId = id;
  }
  return {
    accountCertificateList,
    deleteConfirmationModal,
    deleteCertificate,
    uploadCertificate,
    updateCertificate,
    setDeleteId,
    errors,
    loading
  };
};
