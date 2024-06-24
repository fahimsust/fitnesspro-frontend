export const useSitePaymentMethodSubscription = () => {
  const deleteConfirmationModal = ref(false);
  let paymentMethodId = 0;
  let gatewayAccountId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function getSiteSubscriptionPaymentMethods(id: number) {
    const list: any = await useAsyncData("siteSubscriptionPaymentMethods", () =>
      $larafetch(`site/${id}/payment-options/subscription`)
    );
    return list.data;
  }
  async function addSiteSubscriptionPaymentMethod(formData: object, id: number) {
    loading.value = true;
    let result: any = {};
    try {
      result = await submitRequest(
        $larafetch(`site/${id}/payment-options/subscription/activate`, { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Added Successfully",
            `Subscription payment method successfully added To Site`,
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
  async function deleteSiteSubscriptionPaymentMethod(id: number) {
    try {
      await $larafetch(`/site/${id}/payment-options/subscription/deactivate`, {
        method: "delete",body: {'gateway_account_id':gatewayAccountId,'payment_method_id':paymentMethodId},
      });
      swalTopEnd(
        "Deleted Successfully",
        `Subscription payment method successfully deleted from site`,
        "success"
      );
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 3000);
    }
    deleteConfirmationModal.value = false;
    await getSiteSubscriptionPaymentMethods(id);
  }
  function setArchiveId(payment_method_id: number = 0,gateway_account_id:number = 0) {
    paymentMethodId = payment_method_id;
    gatewayAccountId = gateway_account_id;
  }

  return {
    setArchiveId,
    getSiteSubscriptionPaymentMethods,
    addSiteSubscriptionPaymentMethod,
    deleteSiteSubscriptionPaymentMethod,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
