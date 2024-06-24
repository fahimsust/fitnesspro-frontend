<script setup>
import { useRoute } from "vue-router";
import EditNav from "~/components/affiliate/EditNav";
import SimpleMenu from "~/layouts/simple-menu-new.vue";

const route = useRoute()
const { getAffiliate } = useAffiliates();
let affiliate = ref({})
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  affiliate = await getAffiliate(route.params.id)
  dataLoaded.value = true
}) 
</script>
<template>
    <simple-menu>
        <div v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div>
        <div class="grid grid-cols-12 gap-6 mt-8" v-if="dataLoaded">
            <div class="col-span-12 lg:col-span-3 2xl:col-span-2">
                <h2 class="mt-2 mr-auto text-lg font-medium intro-y">{{ affiliate.name }}</h2>
                <!-- BEGIN: Inbox Menu -->
                <div class="p-5 mt-5 intro-y box bg-primary">
                    <div class=" text-white border-white/10 dark:border-darkmode-400">
                        <EditNav />
                    </div>
                </div>
                <!-- END: Inbox Menu -->
            </div>
            <slot />
        </div>
    </simple-menu>
</template>