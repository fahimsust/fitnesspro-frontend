export const useAffiliateReferrals = () => {
    const route = useRoute();
    const page = route.query.page
    const keyword = route.query.keyword
    const status = route.query.status
    const keywordString = ref(typeof keyword == 'string' ? keyword : "")
    const currentPage = ref(typeof page == 'string' ? parseInt(page) : 1)
    const referralStatus = ref(typeof status == 'string' ? parseInt(status) : "")
    const order_by = route.query.order_by;
    const order_type = route.query.order_type;
    const orderBy = ref(typeof order_by == "string" ? order_by : "");
    const orderType = ref(typeof order_type == "string" ? order_type : "");

    async function list(id:number) {
        let paramString:String = '';
        if (referralStatus.value != 0 && referralStatus.value != "") {
            paramString = `&status_id=${referralStatus.value}`;
        }
        const referralsList: any = await useAsyncData(
            'referrals',
            () => $larafetch(`/referrals/${id}?page=${currentPage.value}&order_by=${
                orderBy.value
              }&order_type=${
                orderType.value
              }&keyword=${keywordString.value}${paramString}&per_page=${useRuntimeConfig().public.perPage}`),
        )

        const referrals = computed(() => referralsList.data.value.data)
        const lastPage = computed(() => referralsList.data.value.last_page)

        return {
            referrals,
            lastPage,
            currentPage,
            keywordString,
            referralStatus,
            orderBy,
            orderType
        }
    }
    return {
        list,
    }

}