export const useShipments = () => {
  const errors: { [key: string]: any } = reactive({});
  let loadingShipment = ref(false);
  const shipmentConfirmationModal = ref(false);
  const deleteId = ref(0);

  async function removeShipment(order_id: number) {
    try {
      await $larafetch(`/order/${order_id}/shipment/${deleteId.value}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Shipment successfully deleted`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    shipmentConfirmationModal.value = false;
  }
  async function updateShipment(formData: object, order_id: number, id: number) {
    loadingShipment.value = true;
    await submitRequest(
      $larafetch(`/order/${order_id}/shipment/${id}`, { method: "put", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Shipment Updated Successfully`,
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
      () => (loadingShipment.value = false)
    );
  }
  async function createShipment(formData: object, order_id: number) {
    loadingShipment.value = true;
    const result: any = await submitRequest(
      $larafetch(`/order/${order_id}/shipment/`, { method: "post", body: formData }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Shipment created successfully`,
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
      () => (loadingShipment.value = false)
    );
    return result.data;
  }
  async function getShipment(shipment_id: number) {

    const shipment: any = await useAsyncData("getShipment", () =>
      $larafetch(`/shipment-print/${shipment_id}`)
    );
    return shipment.data;
  }
  function setDeleteId(id: number) {
    deleteId.value = id;
  }

  return {
    removeShipment,
    createShipment,
    loadingShipment,
    shipmentConfirmationModal,
    setDeleteId,
    errors,
    getShipment,
    updateShipment,
  };
};
