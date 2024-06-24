// orderByUtils.ts

export async function changeOrderBy(order_by: string, orderBy: any, orderType: any, fetchList: any) {
    let order_type = 'asc';
    if (order_by === orderBy.value) {
      if (orderType.value === 'asc') {
        order_type = 'desc';
      }
    }
    orderBy.value = order_by;
    orderType.value = order_type;
    await createOrderByUrl(order_by, order_type);
    await fetchList();
  }  