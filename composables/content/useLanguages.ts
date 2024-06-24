export const useLanguages = () => {
  async function list(site_id:number = 0) {
    let params = ""
    if(site_id > 0)
    {
      params = "?site_id="+site_id
    }
    const list: any = await useAsyncData("languages", () =>
      $larafetch(`/languages${params}`)
    );
    return list.data;
  }
  async function getLanguage(id: number) {
    const result: any = await useAsyncData("language", () =>
      $larafetch(`/languages/${id}`)
    );
    return result.data;
  }
  return {
    list,
    getLanguage,
  };
};