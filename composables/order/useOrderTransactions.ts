export const useOrderTransactions = () => {
  const errors: { [key: string]: any } = reactive({});
  let loading = ref(false);
  async function getOrderTransactions(order_id:number) {
    const transactionList: any = await useAsyncData("orderTransactions", () =>
      $larafetch(`/order/${order_id}/transaction`)
    );
     return  transactionList.data
  }

  return {
    getOrderTransactions,
    errors,
    loading
  };
};
