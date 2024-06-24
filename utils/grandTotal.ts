export const grandTotal = (order: any) => {
  let sub = subTotal(order) + totalShipping(order.shipments);
  let addDiscount = order.addtl_discount ? order.addtl_discount : 0
  let addtl_fee = order.addtl_fee ? order.addtl_fee : 0

  let payment_method_fee = order.payment_method_fee ? order.payment_method_fee : 0
  let totalDiscount = calculateDiscountOrder(order.discounts, sub) + addDiscount

  let total = sub - totalDiscount + addtl_fee + payment_method_fee

  if (total < 0) {
    total = 0
  }
  if (total == 0) {
    return total;
  }
  return roundNumber(total);
}