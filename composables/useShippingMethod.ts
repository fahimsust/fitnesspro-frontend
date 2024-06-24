export const useShippingMethod = () => {
   
    async function shippingMethods() {
        const list: any = await useAsyncData(
            'shippingMethods',
            () => $larafetch(`/shipping-methods`),
        )
        return list.data;
    }
    
    return {
        shippingMethods
    }

}