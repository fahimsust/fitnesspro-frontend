export const useCurrencies = () => {
  async function list(site_id:number = 0) {
    let params = ""
    if(site_id > 0)
    {
      params = "?site_id="+site_id
    }
    const list: any = await useAsyncData("currencies", () =>
      $larafetch(`/currency${params}`)
    );
    return list.data;
  }
  async function getCurrency(id: number) {
    const result: any = await useAsyncData("currency", () =>
      $larafetch(`/currency/${id}`)
    );
    return result.data;
  }
  return {
    list,
    getCurrency,
  };
};