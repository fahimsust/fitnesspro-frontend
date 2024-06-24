export const calculateTotalCost = (item: any, discounts: any = null) => {
  let price = 0;
  let totalPrice = 0;
  let discountList = []
  let qty = 0;
  if (item.price_reg != undefined) {
    price = item.price_reg
    if (item.onsale) {
      price = item.price_sale
    }
    totalPrice = item.qty * price
    qty = item.qty
    discountList = discounts
  }
  else {
    price = item.product_price
    if (item.product_onsale) {
      price = item.product_saleprice
    }
    totalPrice = item.product_qty * price
    qty = item.product_qty
    discountList = item.discounts
  }

  let totalDiscount = calculateDiscount(discountList, price, qty)
  const totalCost = totalPrice - totalDiscount
  return roundNumber(totalCost);
}