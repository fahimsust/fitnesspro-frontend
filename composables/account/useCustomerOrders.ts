export const useCustomerOrders = () => {

  async function accountOrderList(account_id: number) {
    let paramString = `account_id=${account_id}`;
    const accountOrderList: any = await useAsyncData("accountOrderList", () =>
      $larafetch(`/account-order?${paramString}`)
    );
    return accountOrderList.data;
  }
  return {
    accountOrderList,
  };
};
