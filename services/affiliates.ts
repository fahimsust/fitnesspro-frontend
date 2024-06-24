export default ($larafetch,useAsyncData) =>{
    return {
       getAffiliateList: async  (currentPage,perPage) => {
            return await useAsyncData(
                'affiliates',
                () => $larafetch(`/affiliate?page=${currentPage.value}&per_page=${perPage}`),
                { watch: [currentPage] }
            )
       },
    }
  }