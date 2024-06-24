export const usePaymentAccount = () => {
    async function getPaymentAccounts(payment_method_id:number = 0) {
      let params = ''
      if(payment_method_id > 0)
      {
        params = "?payment_method_id="+payment_method_id
      }
      const list: any = await useAsyncData("paymentAccounts", () =>
        $larafetch(`/payment-account${params}`)
      );
      return list.data;
    }
    return {
      getPaymentAccounts,
    };
  };