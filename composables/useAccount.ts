export const useAccount = () => {
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function createAccount(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Created Successfully",
          `Account created successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function accountData() {
    let data: any = {}
    try {
      const list: any = await useAsyncData("accountData", () =>
        $larafetchfront(`/registration/show`)
      );
      data = list.data
    } catch (error: any) {

    }

    return data;
  }
  async function membershipLevels() {
    const list: any = await useAsyncData("membershipLevels", () =>
      $larafetchfront(`/registration/membership-level`)
    );
    return list.data;
  }
  async function accountMembershipLevels() {
    const list: any = await useAsyncData("accountMembershipLevels", () =>
      $larafetchfront(`/registration/membership-level/current`)
    );
    return list.data;
  }
  async function saveMembershipLevel(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/membership-level", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Membership Level added to account`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }


  async function accountAffiliate() {
    const list: any = await useAsyncData("accountAffiliate", () =>
      $larafetchfront(`/registration/affiliate`)
    );
    return list.data;
  }
  async function saveAffiliate(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/affiliate", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Payment Method added to account`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }



  async function paymentMethods() {
    const list: any = await useAsyncData("paymentMethods", () =>
      $larafetchfront(`/registration/payment-method`)
    );
    return list.data;
  }
  async function accountPaymentMethods() {
    const list: any = await useAsyncData("accountPaymentMethods", () =>
      $larafetchfront(`/registration/payment-method/current`)
    );
    return list.data;
  }
  async function savePaymentMethod(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/payment-method", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Payment Method added to account`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }


  async function billingAddresses() {
    const list: any = await useAsyncData("billingAddresses", () =>
      $larafetchfront(`/registration/billing-address`)
    );
    return list.data;
  }
  async function defaultBilling() {
    const list: any = await useAsyncData("defaultBilling", () =>
      $larafetchfront(`/registration/billing-address/show`)
    );
    return list.data;
  }
  async function saveBillingAddress(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/billing-address", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Default billing address saved to account`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function updateBillingAddress(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/billing-address", {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Billing address updated`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getRegistrationDiscounts() {
    const list: any = await useAsyncData("registrationDiscounts", () =>
      $larafetchfront(`/registration/discount`)
    );
    return list.data;
  }
  async function deleteDiscount(registration_discount_id: number) {
    try {
      await $larafetchfront(`/registration/discount/`, { method: "delete", body: { registration_discount_id: registration_discount_id } })
      swalTopEnd(
        "Deleted Successfully",
        `Discount successfully removed`,
        "success"
      );
    }
    catch (error: any) {
      swalTopEnd(
        "",
        error.data?.message,
        "error",
        10000
      );
    }
    await getRegistrationDiscounts();
  }
  async function saveDiscountCode(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/registration/discount", {
        method: "post",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Saved Successfully",
          `Discount added to account`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Create failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }



  return {
    createAccount,
    membershipLevels,
    accountMembershipLevels,
    saveMembershipLevel,
    paymentMethods,
    accountPaymentMethods,
    savePaymentMethod,
    accountAffiliate,
    saveAffiliate,
    billingAddresses,
    defaultBilling,
    saveBillingAddress,
    updateBillingAddress,
    getRegistrationDiscounts,
    saveDiscountCode,
    deleteDiscount,
    accountData,
    errors,
    loading
  };
};
