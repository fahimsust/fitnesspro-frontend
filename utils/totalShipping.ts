export const totalShipping = (shipments: any) => {
  let total = 0;
  shipments.forEach((shipment: any) => {
    if(shipment.ship_cost != undefined)
    {
      total += parseFloat(shipment.ship_cost)
    }
    else if(shipment.shipping_cost != undefined)
    {
      total += parseFloat(shipment.shipping_cost)
    }
    
  });
  if(total == 0)
  {
    return total;
  }
  return roundNumber(total);
}