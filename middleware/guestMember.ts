export default defineNuxtRouteMiddleware(async () => {
  const account: any = useAccountState()

  if (account.value) {
    return navigateTo("/frontend/", { replace: true })
  }

})