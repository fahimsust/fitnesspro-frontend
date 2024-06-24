export const useOrderItems = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingOrderItem = ref(false);
  const deleteItemConfirmationModal = ref(false);
  const deleteItemId = ref(0);
  const currentPage = ref(1);

  async function removeOrderItem(package_id: number, formData: object) {
    try {
      await $larafetch(`/package/${package_id}/delete-items/`, { method: "post", body: formData });
      swalTopEnd(
        "Deleted Successfully",
        `Items successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteItemConfirmationModal.value = false;
  }
  async function moveOrderItem(formData: object, package_id: number, id: number) {
    loadingOrderItem.value = true;
    await submitRequest(
      $larafetch(`/package/${package_id}/item/${id}/move`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Moved",
          `Order Item moved successfully`,
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
          swalTopEnd("Moved failed", errorString, "error");
        }
      },
      () => (loadingOrderItem.value = false)
    );
  }
  async function updateOrderItemQty(formData: object, package_id: number, id: number) {
    loadingOrderItem.value = true;
    await submitRequest(
      $larafetch(`/package/${package_id}/item/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Successfully Update",
          `Item qty successfully updated`,
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
      () => (loadingOrderItem.value = false)
    );
  }
  async function createOrderItem(formData: object, package_id: number) {
    loadingOrderItem.value = true;
    try {
       await submitRequest(
        $larafetch(`/package/${package_id}/item/`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Order item created successfully`,
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
            swalTopEnd("failed", errorString, "error");
          }
        },
        () => (loadingOrderItem.value = false)
      );
    } catch (error: any) {
      clearValidationErrors(errors);
      errors['message'] = error.data?.message
      swalTopEnd("", error.data?.message, "error", 10000);
    }
  }
  async function searchProductItem(
    order_id: number,
    keyword: string = ""
  ) {
    let paramString = `page=${currentPage.value
      }&hide_children=1&order_id=${order_id}&keyword=${keyword}&per_page=${useRuntimeConfig().public.perPage
      }`;
    const productList: any = await useAsyncData("searchProductItem", () =>
      $larafetch(`/product?${paramString}`)
    );

    const products = computed(() => productList.data.value.data);
    const lastPage = computed(() => productList.data.value.last_page);

    return {
      products,
      lastPage,
      currentPage,
    };
  }
  async function getProductDetails(product_id: number) {
    const product: any = await useAsyncData("getProductDetails", () =>
      $larafetch(`/product/${product_id}/order-product`)
    );
    return product.data;
  }
  function setDeleteIdPackageItem(id: number) {
    deleteItemId.value = id;
  }

  return {
    removeOrderItem,
    createOrderItem,
    loadingOrderItem,
    searchProductItem,
    errors,
    deleteItemConfirmationModal,
    setDeleteIdPackageItem,
    updateOrderItemQty,
    getProductDetails,
    moveOrderItem
  };
};
