<script lang="ts" setup>
import _ from "lodash";
import Settings from "~/components/site/Settings.vue";
import CartAllowAvailibility from "~~/components/site/CartAllowAvailibility.vue";
import AccountType from "~/components/site/AccountType.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const idParem = parseInt(route.params.id.toString());
const { all } = useAccountType();
const accountTypes = await all();

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const { getSiteSetting } = useSiteSetting();
let siteSetting = ref({});
const { getSite } = useSites();
let site: any = ref({});

const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  site = await getSite(idParem);
  siteSetting = await getSiteSetting(idParem);
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div>
    <div class="col-span-12 intro-y" v-if="dataLoaded">
      <div class="p-5 intro-y box xl:mt-5">
        <Settings v-model="siteSetting" />
        <hr class="my-4" />
        <CartAllowAvailibility v-model="siteSetting" />
        <hr class="my-4" />
        <AccountType v-model="site" :account-types="accountTypes" />
      </div>
    </div>
  </div>
</template>