export const createNewPathForSearchAndPush = (paramNameValues:Array<Object>, resetPagination: boolean) => 
{
    const route = useRoute()
    const router = useRouter()
    let path:string = route.path
    for(let key in paramNameValues)
    {
        const paramNameValue:any = paramNameValues[key]
        if(paramNameValue.value)
        {
            if(!path.includes("?"))
            {
                path = path + "?" + paramNameValue.name + "=" + paramNameValue.value;
            }
            else
            {
                path = path + "&" + paramNameValue.name + "=" + paramNameValue.value;
            }
        }
    }
    if (Object.keys(route.query).length !== 0) {
        for (const [key, value] of Object.entries(route.query)) {
            const paramNames:any = paramNameValues.map((paramNameValue:any)=>paramNameValue.name)
            if (!paramNames.includes(key) && value != "") {
                if ((key == "keyword"))
                {
                    if(!path.includes("?"))
                    {
                        path = path + "?" + key + "=" + value;
                    }
                    else
                    {
                        path = path + "&" + key + "=" + value;
                    }
                    
                }
            }
        }
    }
    router.push(path);
}