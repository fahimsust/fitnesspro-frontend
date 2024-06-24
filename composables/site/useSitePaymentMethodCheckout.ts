export const useSitePaymentMethodCheckout = () => {
  const deleteConfirmationModal = ref(false);
  let paymentMethodId = 0;
  let gatewayAccountId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteCheckoutPaymentMethods(id: number) {
    const list: any = await useAsyncData("checkoutSitePaymentMethods", () =>
      $larafetch(`site/${id}/payment-options/checkout/get`)
    );
    return list.data;
  }
  async function editCheckoutSitePaymentMethod(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/payment-options/checkout/update`, { method: "put", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Checkout payment method fees successfully Updated`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 5000);
    }
    return result.data;
  }
  async function addCheckoutSitePaymentMethod(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/payment-options/checkout/activate`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Checkout payment method successfully added To Site`,
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
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 5000);
    }
    return result.data;
  }
  async function deleteSiteCheckoutPaymentMethod(id: number) {
    try {
      await $larafetch(`/site/${id}/payment-options/checkout/deactivate`, {
        method: "delete",body: {'gateway_account_id':gatewayAccountId,'payment_method_id':paymentMethodId},
      });
      swalTopEnd(
        "Deleted Successfully",
        `Checkout payment method successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteCheckoutPaymentMethods(id);
  }
  async function paymentMethods() {
    const list: any = await useAsyncData("paymentMethods", () =>
      $larafetch(`/payment-method`)
    );
    return list.data;
  }
  async function paymentAccounts() {
    const list: any = await useAsyncData("paymentAccounts", () =>
      $larafetch(`/payment-account`)
    );
    return list.data;
  }
  function setArchiveId(payment_method_id: number = 0,gateway_account_id:number = 0) {
    paymentMethodId = payment_method_id;
    gatewayAccountId = gateway_account_id;
  }

  return {
    setArchiveId,
    getSiteCheckoutPaymentMethods,
    addCheckoutSitePaymentMethod,
    deleteSiteCheckoutPaymentMethod,
    editCheckoutSitePaymentMethod,
    paymentMethods,
    paymentAccounts,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
