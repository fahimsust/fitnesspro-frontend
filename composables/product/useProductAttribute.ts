export const useProductAttribute = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  async function getProductTypeAttributes(typeId: number) {
    const list: any = await useAsyncData("productTypeAttributes", () =>
      $larafetch(`product-type/${typeId}/attributes`)
    );
    return list.data;
  }
  async function updateProductType(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product/${id}/update-type`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Product Type updated successfully`,
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
  async function getProductAttributes(id: number) {
    const list: any = await useAsyncData("productAttributes", () =>
      $larafetch(`product-attribute?product_id=${id}`)
    );
    return list.data;
  }
  async function addProductAttributeOption(formData: object) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`product-attribute`, {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "",
          `Successfully saved`,
          "success"
        );
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
          swalTopEnd("Saved failed", erroString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function deleteProductAttributeOption(removeId:number) {
    await useAsyncData("deleteProductAttributeOption", () =>
      $larafetch(`/product-attribute/${removeId}`, {
        method: "delete",
      })
    );
  }

  return {
    getProductTypeAttributes,
    addProductAttributeOption,
    getProductAttributes,
    deleteProductAttributeOption,
    updateProductType,
    errors,
    loading,
  };
};
