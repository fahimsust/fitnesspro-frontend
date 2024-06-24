export const createOrderByUrl = async(order_by:string,order_type:string) => 
{
    const route = useRoute()
    const router = useRouter()
    let path = route.path+"?order_by="+order_by+"&order_type="+order_type
    if (Object.keys(route.query).length !== 0) {
        for (const [key, value] of Object.entries(route.query)) {
            if (key != "order_by" && key != "order_type" && key != "page" && value != "") {
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
    await router.push(path);

}