export const usePaymentMethod = () => {
    async function getPaymentMethods() {
      const list: any = await useAsyncData("paymentMethods", () =>
        $larafetch(`/payment-method/`)
      );
      return list.data;
    }
    return {
        getPaymentMethods,
    };
  };