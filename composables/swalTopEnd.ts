
export const swalTopEnd = (header: String, html:String, icon:String, showTime:number = 3000) => {
    const { $swal } = useNuxtApp()
    $swal.fire({
        position: "top-end",
        title: header,
        html: html,
        icon: icon,
        showConfirmButton: false,
        timer: useRuntimeConfig().public.playwrightTime && useRuntimeConfig().public.playwrightTime != 0?useRuntimeConfig().public.playwrightTime:showTime,
        timerProgressBar: true,
        toast: true,
    });
}