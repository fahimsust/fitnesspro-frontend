export const useSite = () => {
    async function siteList() {
        const list: any = await useAsyncData(
            'countries',
            () => $larafetch(`/site`),
        )
        return list.data;
    }
    
    return {
        siteList,
    }

}