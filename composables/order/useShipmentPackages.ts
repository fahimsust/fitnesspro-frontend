export const useShipmentPackages = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingPackage = ref(false);
  const packageConfirmationModal = ref(false);
  const deleteId = ref(0);

  async function removeShipmentPackage(shipment_id:number) {
    try {
      await $larafetch(`/shipment/${shipment_id}/order-package/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Package successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    packageConfirmationModal.value = false;
  }
  async function updateShipmentPackage(formData: object,shipment_id:number, id: number) {
    loadingPackage.value = true;
    await submitRequest(
      $larafetch(`/shipment/${shipment_id}/order-package/${id}`, { method: "put", body: formData }), 
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Moved Successfully",
          `Package moved to new shipment successfully`,
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
      () => (loadingPackage.value = false)
    );
  }
  async function createShipmentPackage(shipment_id:number) {
    loadingPackage.value = true;
    const result: any = await submitRequest(
      $larafetch(`/shipment/${shipment_id}/order-package/`, { method: "post" }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `New package created successfully`,
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
      () => (loadingPackage.value = false)
    );
    return result.data;
  }
  function setDeleteIdPackage(id: number) {
    deleteId.value = id;
  }

  return {
    removeShipmentPackage,
    createShipmentPackage,
    loadingPackage,
    packageConfirmationModal,
    setDeleteIdPackage,
    updateShipmentPackage,
  };
};
