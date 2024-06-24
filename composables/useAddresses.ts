export const useAddresses = () => {
    let loading = ref(false)
    let countries:any = ref([])
    let states:any = ref([])
    const errors: { [key: string]: any; } = reactive({})
    async function list(keyword:String,account_id?:number) {
        let paramString:String = `?keyword=${keyword}`;
        if (typeof account_id !== 'undefined') {
            paramString = `?keyword=${keyword}&account_id=${account_id}`;
        }
        const addressList: any = await useAsyncData(
            'addresses',
            () => $larafetch(`/address${paramString}`),
        )
        return addressList.data;
    }
    async function countryList() {
        const list: any = await useAsyncData(
            'countries',
            () => $larafetchfront(`/countries`),
        )
        return list.data;
    }
    async function stateList(id:number) {
        const list: any = await useAsyncData(
            'states',
            () => $larafetchfront(`/states/${id}`),
        )
        return list.data;
    }
    async function getAddress(id: number) {
        
        const result: any = await useAsyncData(
            'address',
            () => $larafetch(`/address/${id}`),
        )
        return result.data
    }
    async function updateAddress(formData: object,id:number) {
        loading.value = true
        if(errors)
        {
            for (const [key, _] of Object.entries(errors)) {
                delete errors[key]
            }
        }
        let address_id
        await submitRequest(
            $larafetch(`/address/${id}`, { method: "put", body: formData  }),
            (result:any) => {
                clearValidationErrors(errors)
                swalTopEnd("Updated Successfully",`Address updated successfully`,'success')
                address_id = result.id
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
        return address_id
        
    }
    async function createAddress(formData: object) {
        loading.value = true
        if(errors)
        {
            for (const [key, value] of Object.entries(errors)) {
                delete errors[key]
            }
        }
        let address_id
        await submitRequest(
            $larafetch("/address/", { method: "post", body: formData }),
            (result:any) => {
                clearValidationErrors(errors)
                swalTopEnd("Created Successfully",`Address created successfully`,'success') 
                address_id = result.id
            },
            (validationErrors) => {
                
                if (validationErrors)
                {
                    clearValidationErrors(errors)
                    addValidationErrors(errors, validationErrors)
                    swalTopEnd("Create failed",`Please solve the errors`,'error') 
                }

            },
            () => loading.value = false
        )
        return address_id
        
    }
    return {
        list,
        createAddress,
        errors,
        loading,
        getAddress,
        updateAddress,
        countryList,
        stateList,
        countries,
        states
    }

}