<script lang="ts" setup>
import { ref, toRefs, reactive, type PropType } from "vue"
import { Dialog } from "~/components/enigma/base-components/Headless"
import Lucide from "~/components/enigma/base-components/Lucide"
import Table from "~/components/enigma/base-components/Table"
import Button from "~/components/enigma/base-components/Button"
import EditOptionValue from "~/components/product/option/EditOptionValue.vue"
import AddOptionValue from "~/components/product/option/AddOptionValue.vue"
import AddDateOptionValue from "~/components/product/option/AddDateOptionValue.vue"
import DatePickerField from "~/components/form/DatePickerField.vue"
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon"
import {
  Popover
} from "~/components/enigma/base-components/Headless";

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  option: {
    required: true,
    type: Object as PropType<any>
  },
  modalShow: {
    required: true,
    type: Boolean,
  }
})
const {
  setModel,
  modalShow,
  option
} = toRefs(props)
const searchLoading = ref(false)
const keyword = ref('')
const {
  getProductOptionValues,
  deleteProductOptionValue,
  setArchiveId,
  errors,
  deleteConfirmationModal
} = useProductOption()
const searchByKeyword = async (value: string) => {
  keyword.value = value;
  search();
};
const search = async (closeFunction: Function = () => { }) => {
  searchLoading.value = true
  currentPage.value = 1
  await getProductOptionValues(option.value.id, form, keyword.value);
  closeFunction()
  searchLoading.value = false
};
const list = async () => {
  await getProductOptionValues(option.value.id, form, keyword.value);
}
const removeProductOptionValue = async () => {
  await deleteProductOptionValue()
  await getProductOptionValues(option.value.id, keyword.value);
  if (optionValues.value.length == 0) {
    if (currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
      await getProductOptionValues(option.value.id, keyword.value);
    }
  }
}
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value
}
const slideOver = ref(false)

const setSlideover = (value: boolean) => {
  slideOver.value = value
}
const slideOverAdd = ref(false)

const setSlideoverAdd = (value: boolean) => {
  slideOverAdd.value = value
}
const slideOverDateAdd = ref(false)

const setSlideoverDateAdd = (value: boolean) => {
  slideOverDateAdd.value = value
}
const optionValue = ref({id:0})
const setOptionValue = (value: any) => {
  optionValue.value = value
  setSlideover(true)
}
const createOptionValue = (value: boolean) => {
  if (option.value.option_type.name == "Date Range") {
    setSlideoverDateAdd(value)
  }
  else {
    setSlideoverAdd(value)
  }
}
const replaceByDate = (start_date: string, end_date: string, name: string) => {
  const startDateValue = new Date(start_date)
  const endDateValue = new Date(end_date)
  name = name.replace("{START_DATE}", startDateValue.toLocaleDateString() + " ")
  return name.replace("{END_DATE}", " " + endDateValue.toLocaleDateString())
}
let form = reactive({
  start_date: "",
  end_date: "",
});



let optionValues: any = ref([])
let lastPage: any = ref(1)
let currentPage: any = ref(1)
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const result = await getProductOptionValues(option.value.id, form, keyword.value)
  optionValues = result.optionValues
  lastPage = result.lastPage
  currentPage = result.currentPage
  dataLoaded.value = true
})
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => {
    setModel(false);
  }">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Product Option Values ({{ option.name }})
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <NuxtLink @click="createOptionValue(true)"
            class="bg-primary text-white py-2 px-3 rounded-md font-medium cursor-pointer">
            Create Product Option Value
          </NuxtLink>

          <div class="hidden mx-auto md:block text-slate-500">
            <!-- Showing 1 to 10 of 150 entries -->
          </div>
          <Popover v-if="option.option_type.name == 'Date Range'"
            class="inline-block mr-2 mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0" v-slot="{ close }">
            <Popover.Button :as="Button" variant="primary">
              <Lucide icon="CalendarDays" class="w-4 h-4 mr-1" />
              Date Range
              <Lucide icon="ChevronDown" class="w-4 h-4 ml-2" />
            </Popover.Button>
            <Popover.Panel placement="bottom-start">
              <div class="p-2">
                <div>
                  <DatePickerField name="start_date" v-model="form" :required="true" :error="errors.start_date"
                    title="Start Date" />
                </div>
                <div class="mt-3">
                  <DatePickerField name="end_date" :required="true" v-model="form" :error="errors.end_date"
                    title="End Date" />
                </div>
                <div class="flex items-center mt-3">
                  <Button variant="primary" @click="() => {
                    search(close);
                  }
                    " class="w-64 ml-auto" :class="{ 'cursor-wait': searchLoading }">
                    Search
                  </Button>
                </div>
              </div>
            </Popover.Panel>
          </Popover>
          <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div class="relative w-56 text-slate-500">
              <EnterSearch :key="keyword" v-model="keyword" :searchByKeyword="searchByKeyword" />
            </div>
          </div>
        </div>

        <div class="overflow-y-auto col-span-12">
          <LoadingIcon v-if="searchLoading" icon="three-dots" class="w-8 h-8 block" />
          <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
            <Table.Thead variant="dark" class="text-xs">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                <Table.Th class="whitespace-nowrap">DISPLAY NAME</Table.Th>
                <Table.Th class="whitespace-nowrap" v-if="option.option_type.name != 'Date Range'">RANK</Table.Th>
                <Table.Th class="whitespace-nowrap">PRICE</Table.Th>
                <Table.Th class="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td :colspan="option.option_type.name != 'Date Range'?5:4" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="optionValues.length == 0 && dataLoaded" class="intro-x">
                <Table.Td :colspan="option.option_type.name != 'Date Range'?5:4" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <template v-for="optionValue in optionValues" :key="optionValue.id">
                <Table.Tr class="cursor-pointer"
                  @click="(event: any) => { setOptionValue(optionValue); }">
                  <Table.Td>
                    {{
                      replaceByDate(
                        optionValue.start_date,
                        optionValue.end_date,
                        optionValue.name
                      )
                    }}
                  </Table.Td>
                  <Table.Td>
                    {{
                      replaceByDate(
                        optionValue.start_date,
                        optionValue.end_date,
                        optionValue.display
                      )
                    }}
                  </Table.Td>
                  <Table.Td v-if="option.option_type.name != 'Date Range'">
                    {{ optionValue.rank }}
                  </Table.Td>
                  <Table.Td>
                    {{ optionValue.price }}
                  </Table.Td>
                  <Table.Td>
                    <div class="flex items-center justify-center">
                      <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                        event.preventDefault();
                        setArchiveId(optionValue.id);
                        setConfirmationModal(true);
                        event.stopPropagation();
                      }
                        ">
                        <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                        <span class="hidden">Remove</span>
                      </NuxtLink>
                    </div>
                  </Table.Td>
                </Table.Tr>
              </template>
            </Table.Tbody>
          </Table>
        </div>
        <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
        <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
          subHeader="Do you want to remove this option value?" :setConfirmationModal="setConfirmationModal"
          :set-id="setArchiveId" :functionToRun="removeProductOptionValue" />
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
  <EditOptionValue :key="optionValue.id" :open-parent="setModel" v-if="optionValue.id > 0" :setSlideover="setSlideover" :refreshOptionValue="list" :slideover="slideOver"
    v-model="optionValue" />
  <AddOptionValue v-if="slideOverAdd" :open-parent="setModel" :setSlideover="setSlideoverAdd" :refreshOptionValue="list"
    :slideover="slideOverAdd" :option="option" />
  <AddDateOptionValue v-if="slideOverDateAdd" :open-parent="setModel" :setSlideover="setSlideoverDateAdd" :refreshOptionValue="list"
    :slideover="slideOverDateAdd" :option="option" />
</template>
