import { useAccountState, fetchCurrentAccount } from "~/composables/useAccountAuth"

export default defineNuxtPlugin(async () => {
  const account = useAccountState()

  // Skip if already initialized on server
  if (account.value !== undefined)
    return

  account.value = await fetchCurrentAccount()
})