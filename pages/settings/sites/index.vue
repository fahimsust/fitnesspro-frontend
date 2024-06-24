<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import AddPage from "~~/components/page/AddPage.vue";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
    middleware: ["auth"],
    layout: "simple-menu-new",
});
useHead({
    title: "Sites: " + useRuntimeConfig().public.company,
});

const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.sites)
{ 
  await router.push({ path: `/order/actives`, query: queryParam.sites });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {sites:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/settings/sites/" + id);
};

const {
    list,
} = useSites();
const {
    online,
    offline,
} = useSiteOfflineOnline();


let sites:any = ref([]);
const createLink = () => {
  router.push("/settings/sites/create");
};

const changeStatus = async (value: boolean, id: number) => {
    if (value == true)
        await online(id);
    else
        await offline(id);
    await list();
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
    modalShow.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  sites = await list();
  dataLoaded.value = true
});
</script>

<template>
    <h2 class="mt-10 text-lg font-medium intro-y">Sites</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
            <Button variant="primary" @click="createLink" class="mr-2 shadow-md">
                Create Site
            </Button>
        </div>
        <!-- BEGIN: Data List -->
        <div class="col-span-12 overflow-x-auto intro-y">
            <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
                <Table.Thead variant="dark">
                    <Table.Tr>
                        <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                        <Table.Th class="whitespace-nowrap">URL</Table.Th>
                        <Table.Th class="whitespace-nowrap">VERSION</Table.Th>
                        <Table.Th class="whitespace-nowrap">EMAIL</Table.Th>
                        <Table.Th class="whitespace-nowrap">ACTIVE</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr v-if="!dataLoaded" class="intro-x">
                        <Table.Td colspan="5" class="py-0 px-0">
                        <TableLoading />
                        </Table.Td>
                    </Table.Tr>
                    <Table.Tr v-if="sites.length == 0 && dataLoaded" class="intro-x">
                        <Table.Td colspan="5" class="py-0 px-0">
                        <AlertGray />
                        </Table.Td>
                    </Table.Tr>
                    <Table.Tr v-for="site in sites" @click="editLink(site.id)" :class="'cursor-pointer'" :key="site.id"
                        class="intro-x">
                        <Table.Td>
                            {{ site.name }}
                        </Table.Td>
                        <Table.Td>
                            {{ site.domain }}
                        </Table.Td>
                        <Table.Td>
                            {{ site.version }}
                        </Table.Td>
                        <Table.Td>
                            {{ site.email }}
                        </Table.Td>
                        <Table.Td>
                            <FormSwitch.Input type="checkbox" :key="site.status" v-model="site.status" @click="(event: any) => {
                                    event.preventDefault();
                                    changeStatus(!site.status, site.id);
                                    event.stopPropagation();
                                }
                                " />
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </div>
        <!-- END: Data List -->
    </div>
    <AddPage :modal-show="modalShow" :set-modal="setModal" />
</template>