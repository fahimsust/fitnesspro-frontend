<script setup lang="ts">
import AddDiscountLevel from "~/components/discount/level/AddDiscountLevel.vue";
import Button from "~/components/enigma/base-components/Button";
import Table from "~/components/enigma/base-components/Table";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Discount Levels: " + useRuntimeConfig().public.company,
});

const {
  discountLevels,
  statusChange
} = useDiscountLevel();

const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.discount_level)
{ 
  await router.push({ path: `/catalog/discounts/levels`, query: queryParam.discount_level });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {discount_level:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/catalog/discounts/levels/" + id);
};

let discountLevelList:any = ref([])
const fetchList = async () => {
  await discountLevels();
}

const changeStatus = async (value: boolean, id: number) => {
  let form = { status: value };
  await statusChange(form, id);
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  discountLevelList = await discountLevels();
  dataLoaded.value = true
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Discount Level</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" @click="setModal(true)" class="mr-2 shadow-md">
        Create New Discount Level
      </Button>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap">TYPE</Table.Th>
            <Table.Th class="whitespace-nowrap">STATUS</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="discountLevelList.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="4" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="discountLevel in discountLevelList" @click="editLink(discountLevel.id)"
            :class="'cursor-pointer'" :key="discountLevel.id" class="intro-x">
            <Table.Td>
              {{ discountLevel.id }}
            </Table.Td>
            <Table.Td>
              {{ discountLevel.name }}
            </Table.Td>
            <Table.Td>
              {{ discountLevel.level_type.name }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="discountLevel.status" v-model="discountLevel.status" @click="(event: any) => {
                event.preventDefault();
                changeStatus(!discountLevel.status, discountLevel.id);
                event.stopPropagation();
              }
                " />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <AddDiscountLevel :refresh="fetchList" :modal-show="modalShow" :set-modal="setModal" />
</template>
