<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Alert from "~/components/enigma/base-components/Alert";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { ref } from "vue";
import SearchBrand from "~~/components/category/SearchBrand.vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-category",
});

useHead({
  title: "Manage Category Brand: " + useRuntimeConfig().public.company,
});

const {
  getCategoryBrand,
  addCategoryBrand,
  deletebrand,
  deleteConfirmationModal,
  setArchiveId,
} = useCategoryBrand();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
let brands:any = ref([]);
const removeBrand = () => {
  deletebrand(idParem);
};
const add = async (id: number) => {
  let data = reactive({ brand_id: id });
  await addCategoryBrand(data, idParem);
  brands = await getCategoryBrand(idParem);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  brands = await getCategoryBrand(idParem);
  dataLoaded.value = true;
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <Button @click="() => setModal(true)" variant="primary" class="mr-2 shadow-md">
          Add Brand
        </Button>
        <div class="overflow-x-auto">
          <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">ID</Table.Th>
                <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                <Table.Th class="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="brands.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="3" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-for="brand in brands" :key="brand.id" class="intro-x">
                <Table.Td>
                  {{ brand.id }}
                </Table.Td>
                <Table.Td>
                  {{ brand.name }}
                </Table.Td>
                <Table.Td>
                  <div class="flex items-center justify-center">
                    <NuxtLink
                      class="flex text-danger cursor-pointer"
                      @click="
                        (event) => {
                          event.preventDefault();
                          setArchiveId(brand.id);
                          setConfirmationModal(true);
                        }
                      "
                    >
                      <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                      <span class="hidden">Remove</span>
                    </NuxtLink>
                  </div>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
  <SearchBrand
    :add="add"
    v-if="modalShow"
    :key="modalShow ? 'true' : 'false'"
    :setModel="setModal"
    :modalShow="modalShow"
  />
  <Confirmation
    v-model="deleteConfirmationModal"
    buttonStringMain="Remove"
    subHeader="Do you want to remove this brand from category?"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="removeBrand"
  />
</template>
