export const useProductBulkEditor = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function findCriteria() {
    const list: any = await useAsyncData("findCriteria", () =>
      $larafetch(`/bulk-edit-find`)
    );
    return list.data;
  }
  async function performCriteria() {
    const list: any = await useAsyncData("performCriteria", () =>
      $larafetch(`/bulk-edit-perform`)
    );
    return list.data;
  }
  async function searchProduct(searchOption: object) {
    loading.value = true;
    let result: any = {};
    try {
       result = await submitRequest(
        $larafetch(`bulk-edit-find`, {
          method: "post",
          body: searchOption,
        }),
        (_: any) => {
          clearValidationErrors(errors);
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            let erroString = "";
            for (const [_, value] of Object.entries(errors)) {
              erroString = "<span class='text-red-600'>" + value + "</span>";
              break;
            }
            swalTopEnd("", erroString, "error");
          }
        },
        () => (loading.value = false)
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 2000);
      loading.value = false
    }
    return result.data;
  }
  async function perform(searchOption: object) {
    loading.value = true;
    let result: any = {};
    try {
       result = await submitRequest(
        $larafetch(`bulk-edit-perform`, {
          method: "post",
          body: searchOption,
        }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Updated Successfully",
            `Product updated successfully`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 2000);
    }
    return result.data;
  }

  return {
    findCriteria,
    searchProduct,
    performCriteria,
    perform,
    errors,
    loading
  };
};
