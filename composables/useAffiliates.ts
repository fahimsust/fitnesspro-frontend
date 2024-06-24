export const useAffiliates = () => {
    const route = useRoute();
    const router = useRouter()
    const page = route.query.page
    const keyword = route.query.keyword
    const status = route.query.status
    const keywordString = ref(typeof keyword == 'string' ? keyword : "")
    const currentPage = ref(typeof page == 'string' ? parseInt(page) : 1)
    const affiliateStatus = ref(typeof status == 'string' ? parseInt(status) : 1)
    const errors: { [key: string]: any; } = reactive({})
    let loading = ref(false)
    const deleteConfirmationModal = ref(false)
    const restoreConfirmationModal = ref(false)
    let archiveId = 0
    const order_by = route.query.order_by;
    const order_type = route.query.order_type;
    const orderBy = ref(typeof order_by == "string" ? order_by : "");
    const orderType = ref(typeof order_type == "string" ? order_type : "");

    async function list() {
        const affiliatesList: any = await useAsyncData(
            'affiliates',
            () => $larafetch(`/affiliate?page=${currentPage.value}&order_by=${
                orderBy.value
              }&order_type=${
                orderType.value
              }&keyword=${keywordString.value}&status=${affiliateStatus.value}&per_page=${useRuntimeConfig().public.perPage}`),
            { watch: [currentPage] }
        )

        const affiliates = computed(() => affiliatesList.data.value.data)
        const lastPage = computed(() => affiliatesList.data.value.last_page)

        return {
            affiliates,
            lastPage,
            currentPage,
            keywordString,
            affiliateStatus,
            orderBy,
            orderType
        }
    }
    async function archive() {
        await useAsyncData(
            'affiliates',
            () => $larafetch(`/affiliate/${archiveId}`, { method: "delete" }),
        )
        swalTopEnd("Archived Successfully",`Affiliate successfully archived`,'success')
        deleteConfirmationModal.value=false
        const { affiliates } = await list();
        if (affiliates.value.length == 0) {
            if (currentPage.value > 1) {
            currentPage.value = currentPage.value - 1;
            await list();
            }
        }
    }
    async function restore(id: number) {
        await useAsyncData(
            'affiliates',
            () => $larafetch(`/affiliate-archive/${id}`, { method: "put" }),
        )
        swalTopEnd("Restore Successfully",`Affiliate successfully Restored`,'success')
        restoreConfirmationModal.value=false
        const { affiliates } = await list();
        if (affiliates.value.length == 0) {
            if (currentPage.value > 1) {
            currentPage.value = currentPage.value - 1;
            await list();
            }
        }
    }
    async function updateAddress(id: number,address_id:number) {
        await useAsyncData(
            'address_updated',
            () => $larafetch(`/affiliate-address/${id}`, { method: "put",body:{'address_id':address_id} }),
        )
        swalTopEnd("Address Updated",`Affiliate address successfully updated`,'success')
    }
    async function updateAffiliate(formData: object,id:number) {
        loading.value = true
        await submitRequest(
            $larafetch(`/affiliate/${id}`, { method: "put", body: formData  }),
            (result:any) => {
                clearValidationErrors(errors)
                swalTopEnd("Updated Successfully",`Affiliate updated successfully`,'success')
            },
            (validationErrors) => {
                
                if (validationErrors)
                {
                    clearValidationErrors(errors)
                    addValidationErrors(errors, validationErrors)
                    swalTopEnd("Update failed",`Please solve the errors`,'error') 
                }

            },
            () => loading.value = false
        )
        
    }
    async function createAffiliate(formData: object) {
        loading.value = true
        await submitRequest(
            $larafetch("/affiliate/", { method: "post", body: formData }),
            (result:any) => {
                clearValidationErrors(errors)
                swalTopEnd("Created Successfully",`Affiliate created successfully`,'success')
                router.push("affiliates/"+result.id)
              
            },
            (validationErrors) => {
                
                if (validationErrors)
                {
                    clearValidationErrors(errors);
                    addValidationErrors(errors, validationErrors);
                    swalTopEnd("Create failed",`Please solve the errors`,'error') 
                }

            },
            () => loading.value = false
        )
        
    }
    async function getAffiliate(id: number) {
        const result: any = await useAsyncData(
            'affiliate',
            () => $larafetch(`/affiliate/${id}`),
        )
        return result.data
    }
    async function affiliateLevels() {
        const result: any = await useAsyncData(
            'affiliateLevels',
            () => $larafetch(`/affiliate-level`),
        )
        return result.data
    }
    function setArchiveId(id:number){
        archiveId = id
    }

    return {
        list,
        archive,
        restore,
        createAffiliate,
        errors,
        loading,
        deleteConfirmationModal,
        restoreConfirmationModal,
        setArchiveId,
        affiliateLevels,
        getAffiliate,
        updateAffiliate,
        updateAddress
    }
}