<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import AddOption from "~/components/product/option/AddOption.vue";
import OptionValues from "~/components/product/option/OptionValues.vue";
import LanguageOption from "~/components/product/option/LanguageOption.vue";
import Button from "~/components/enigma/base-components/Button";

import { FormSwitch } from "~/components/enigma/base-components/Form";
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Edit Product Option: " + useRuntimeConfig().public.company,
});

const {
  getProductOption,
  updateProductOption,
  deleteProductOption,
  deleteConfirmationModal,
  resetPage,
  setArchiveId,
} = useProductOption();

const route = useRoute();
const idParem = parseInt(route.params.id.toString());

let options: any = ref([])
let lastPage: any = ref(1)
let currentPage: any = ref(1)
let keywordString: any = ref('')
let orderBy: any = ref('');
let orderType: any = ref('');
const dataLoaded = ref(false)
const fetchData = async () => {
  const result = await getProductOption(idParem);
  options = result.options
  lastPage = result.lastPage
  currentPage = result.currentPage
  keywordString = result.keywordString
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}
const slideOver = ref(false);

const fetchList = async () => {
  await getProductOption(idParem);
};
const searchByKeyword = async (value: string) => {
  resetPage();
  createNewPathAndPush("keyword", value, true);
  await fetchList();
};
const createOption = (value: boolean) => {
  setSlideover(value);
};
const setSlideover = (value: boolean) => {
  slideOver.value = value;
};

const setValue = async (fieldName: string, value: any, productOption: any) => {
  let form: any = reactive({
    name: productOption.name,
    display: productOption.display,
    rank: productOption.rank,
    show_with_thumbnail: productOption.show_with_thumbnail,
  });
  if (fieldName == "show_with_thumbnail") {
    form[fieldName] = !form[fieldName];
  }
  await updateProductOption(form, productOption.id);
  await fetchList();
};
const setVlueIfChange = async (fieldName: string, value: any, productOption: any) => {
  if (is_change.value == true) {
    await setValue(fieldName, value, productOption);
    is_change.value = false;
  }
};
const is_change = ref(false);

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const removeProductOption = () => {
  deleteProductOption(idParem);
};
let option = ref({id:0});
let modelkey = ref(0);
const modalShow = ref(false);
const setOption = (singleOption: any, value: boolean) => {
  option.value = singleOption;
  modelkey.value = singleOption.id;
  setModel(value);
};
const setModel = (value: boolean) => {
  modalShow.value = value;
};

let optionLanguage = ref({id:0});
let modelkeyLanguage = ref(0);
const modalShowLanguage = ref(false);
const setOptionLanguage = (singleOption: any, value: boolean) => {
  optionLanguage.value = singleOption;
  modelkeyLanguage.value = singleOption.id;
  setModelLanguage(value);
};
const setModelLanguage = (value: boolean) => {
  modalShowLanguage.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
})
const listFetch = async()=>{
  currentPage.value = 1
  await getProductOption(idParem);
}
const headerColumns = ref([
  { label: '', field: '', sortable: false },
  { label: 'OPTION', field: 'name', sortable: true },
  { label: 'DISPLAY NAME', field: 'display', sortable: true },
  { label: 'RANK', field: 'rank', sortable: true, extraClass: "text-right" },
  { label: 'THUMBNAIL', field: 'show_with_thumbnail', sortable: true, extraClass: "text-center" },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, listFetch);
}
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 xl:mt-5 intro-y box">
      <div
        class="flex flex-wrap items-center justify-between col-span-12 mt-5 pt-5 pb-5 xl:pb-0 intro-y sm:flex-nowrap">
        <Button @click="createOption(true)" variant="primary" class="ml-5 mb-2 sm:mb-0 shadow-md">
          Create Product Option
        </Button>

        <div class="hidden mx-auto md:block text-slate-500">
          <!-- Showing 1 to 10 of 150 entries -->
        </div>

        <div class="w-full px-5 sm:w-auto sm:ml-auto md:ml-0">
          <div class="relative w-56 text-slate-500">
            <EnterSearch v-model="keywordString" :searchByKeyword="searchByKeyword" />
          </div>
        </div>
      </div>
      <div class="px-5 intro-y xl:mt-5 overflow-x-auto">
        <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
          <SortableTableHeader :columns="headerColumns" :orderBy="orderBy" :orderType="orderType"
          :handleSort="changeOrder" :v-if="dataLoaded" />
          <Table.Tbody>
            <Table.Tr v-if="!dataLoaded" class="intro-x">
              <Table.Td colspan="6" class="py-0 px-0">
                <TableLoading />
              </Table.Td>
            </Table.Tr>
            <Table.Tr v-if="options.length == 0 && dataLoaded" class="intro-x">
              <Table.Td colspan="6" class="py-0 px-0">
                <AlertGray />
              </Table.Td>
            </Table.Tr>
            <template v-for="option in options" :key="option.id">
              <Table.Tr class="intro-x">
                <Table.Td class="align-top">
                  <Button variant="pending" class="w-auto mb-1 mr-2 text-xs" @click="(event) => {
                    event.preventDefault();
                    setOption(option, true);
                  }
                    ">
                    <Lucide icon="List" class="w-4 h-4 mr-2" />Values
                  </Button>
                  <Button variant="pending" class="w-auto mb-1 mr-2 text-xs" @click="(event) => {
                    event.preventDefault();
                    setOptionLanguage(option, true);
                  }
                    ">
                    <Lucide icon="Languages" class="w-4 h-4 mr-2" />Translations
                  </Button>
                </Table.Td>
                <Table.Td class="align-top">
                  <input class="input_class align-top" type="text" v-model="option.name" @change="is_change = true"
                    @blur="setVlueIfChange('name', ($event.target as HTMLInputElement).value, option)" />
                  <div class="mt-2 ml-2 text-success">{{ option.option_type.name }}</div>
                </Table.Td>
                <Table.Td class="align-top">
                  <input class="input_class align-top" type="text" v-model="option.display" @change="is_change = true"
                    @blur="setVlueIfChange('display', ($event.target as HTMLInputElement).value, option)" />
                </Table.Td>
                <Table.Td class="max-w-[100px] text-right align-top">
                  <input class="input_class max-w-[75px] text-right" type="number" v-model="option.rank"
                    @change="is_change = true"
                    @blur="setVlueIfChange('rank', ($event.target as HTMLInputElement).value, option)" />
                </Table.Td>
                <Table.Td class="text-center align-top">
                  <div class="flex items-center justify-center">
                    <FormSwitch>
                      <FormSwitch.Input type="checkbox" id="onsale" v-model="option.show_with_thumbnail"
                        @click="setValue('show_with_thumbnail', ($event.target as HTMLInputElement).value, option)" />
                    </FormSwitch>
                  </div>
                </Table.Td>
                <Table.Td class="align-top">
                  <div class="flex items-center justify-center">
                    <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                      event.preventDefault();
                      setArchiveId(option.id);
                      setConfirmationModal(true);
                    }
                      ">
                      <Lucide icon="Trash2" class="w-4 h-4 mr-2" />
                      <span class="hidden">Remove</span>
                    </NuxtLink>
                  </div>
                </Table.Td>
              </Table.Tr>
            </template>
          </Table.Tbody>
        </Table>
        <Pagination class="mb-5" v-if="dataLoaded" :key="currentPage" v-model="currentPage" :getList="fetchList" :numberOfPages="lastPage" />
      </div>
    </div>
  </div>
  <option-values v-if="option.id>0" :key="modelkey" :modalShow="modalShow" :setModel="setModel" :option="option" />
  <LanguageOption v-if="optionLanguage.id>0" :key="modelkeyLanguage" :modalShow="modalShowLanguage"
    :setModel="setModelLanguage" :option="optionLanguage" />
  <AddOption :setSlideover="setSlideover" :refreshOption="fetchList" :slideover="slideOver" />
  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this option?" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
    :functionToRun="removeProductOption" />
</template>
<style lang="postcss" scoped>
.input_class {
  @apply disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 flex-1;
}
</style>
