export const useFaqsCategories = () => {
  const deleteConfirmationModal = ref(false);
  let archiveId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getFaqCategories(id: number) {
    const list: any = await useAsyncData("faqsCategories", () =>
      $larafetch(`faq/${id}/category`)
    );
    return list.data;
  }
  async function addFaqCategory(formData: object, id: number) {
    loading.value = true;
    let result:any = {}
    try{
      result = await submitRequest(
        $larafetch(`/faq/${id}/category`, { method: "post", body: formData }),
        (result: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Category successfully Added To Faq`,
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
  async function deleteCategory(category_id: number) {
    try{
      await $larafetch(`/faq/${category_id}/category/${archiveId}`, {
        method: "delete",
      })
      swalTopEnd(
        "Deleted Successfully",
        `Category successfully deleted from faq`,
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
    deleteConfirmationModal.value = false;
    await getFaqCategories(category_id);
  }
  function setArchiveId(id: number) {
    archiveId = id;
  }

  return {
    setArchiveId,
    getFaqCategories,
    addFaqCategory,
    deleteCategory,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
