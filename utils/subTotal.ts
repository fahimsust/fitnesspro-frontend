export const subTotal = (order: any) => {
  let total = 0;
  if(order.items != undefined)
  {
    order.items.forEach((item: any) => {
      if (item && item.cart_item.product) {
        total += calculateTotalCost(item.cart_item,item.discounts);
      }
    });
  }
  else
  {
    order.shipments.forEach((shipment: any) => {
      let shipmentItemPrice = 0
      if(shipment.packages != undefined)
      shipment.packages.forEach((itemPackage: any) => {
        itemPackage.items.forEach((item: any) => {
          if (item && item.product) {
            shipmentItemPrice += calculateTotalCost(item);
          }
        });
      });
      if (shipmentItemPrice < 0) {
        shipmentItemPrice = 0 
      }
      total += shipmentItemPrice
    });
  }
  
  if(total == 0)
  {
    return total;
  }
  return roundNumber(total);
}