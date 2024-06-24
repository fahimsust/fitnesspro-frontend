export const useCustomerPhotos = () => {
  let photoId = 0
  const deleteConfirmationModal = ref(false);
  async function accountPhotoList(account_id: number) {
    let paramString = `account_id=${account_id}`;
    const accountPhotoList: any = await useAsyncData("accountPhotoList", () =>
      $larafetch(`/account-photo?${paramString}`)
    );
    return accountPhotoList.data;
  }
  async function statusChange(value: boolean, id: number) {
    const formData = { 'approved': value }
    await useAsyncData("photStatusChange", () =>
      $larafetch(`/account-photo/${id}`, {
        method: "put",
        body: formData,
      })
    );
    if (value == true) {
      swalTopEnd("Photo Approved", `Photo Approved Successfully`, "success");
    }
    else {
      swalTopEnd("Photo Unapproved", `Photo Unapproved Successfully`, "success");
    }
  }
  async function deletePhoto() {
    try {
      await $larafetch(`/account-photo/${photoId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Photo successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  function setDeleteId(id: number) {
    photoId = id;
  }
  return {
    accountPhotoList,
    deleteConfirmationModal,
    deletePhoto,
    statusChange,
    setDeleteId
  };
};
