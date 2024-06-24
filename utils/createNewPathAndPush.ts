export const createNewPathAndPush = (paramName: string, paramValue: string, resetPagination: boolean) => 
{
    const route = useRoute()
    const router = useRouter()
    let path = route.path + "?" + paramName + "=" + paramValue;
    if(paramValue == "")
    {
        path = route.path
    }

    if (Object.keys(route.query).length !== 0) {
        for (const [key, value] of Object.entries(route.query)) {
            if (key != paramName && value != "") {
                if (!resetPagination || key != "page")
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