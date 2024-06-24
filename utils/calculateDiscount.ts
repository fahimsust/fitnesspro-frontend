export const calculateDiscount = (discounts: any, price: any, qty: number = 1) => {
  if (!Array.isArray(discounts)) {
    discounts = [discounts];
  }
  let discountValue = 0;

  discounts.forEach((value: any) => {

    if (value && value.pivot && value.pivot.amount) {
      if (value.pivot.amount.toLowerCase() == "free") {
        discountValue += price * qty;
      } else if (value.pivot.amount.indexOf('%') !== -1) {
        let discountAmount = parseInt(value.pivot.amount.replace("%", ""));
        discountValue += ((price * discountAmount) / 100) * qty * value.pivot.qty;
      } else {
        discountValue += parseInt(value.pivot.amount) * value.pivot.qty;
      }
    }
  });
  if (discountValue == 0) {
    return discountValue;
  }
  discountValue = Math.max(0, discountValue);

  discountValue = roundNumber(discountValue);
  return discountValue;
}