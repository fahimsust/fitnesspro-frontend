<script lang="ts" setup>
import { ref, toRefs, reactive, type PropType } from "vue"
import { Dialog } from "~/components/enigma/base-components/Headless"
import Lucide from "~/components/enigma/base-components/Lucide"
import Table from "~/components/enigma/base-components/Table"
import Button from "~/components/enigma/base-components/Button"

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  setModel: {
    required: true,
    type: Function,
  },
});
const product = ref(props.modelValue);
const { modalShow, setModel } = toRefs(props)
const {
  awaitingList,
  createVariant,
} = useProductVariant()
let awaitingVariants:any = ref([])
const loading = ref(false);
const createAll = async () => {
  loading.value = true
  let option_values: any = {}
  awaitingVariants.value.forEach(function (item: any, index: number, arr: any) {
    Object.assign(option_values, item.ids)
  });
  let form = reactive({
    'option_values': option_values
  })
  await createVariant(product.value.id, form)
  await awaitingList(product.value.id)
  loading.value = false
  setModel.value(false);
}

const create = async (option_values: any) => {

  let form = reactive({
    'option_values': option_values
  })
  await createVariant(product.value.id, form)
  await awaitingList(product.value.id)
  setModel.value(false);
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  awaitingVariants = await awaitingList(product.value.id)
  dataLoaded.value = true
});
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Option Combinations Awaiting</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="overflow-y-auto col-span-12">
          <Button variant="primary" @click="createAll" v-if="dataLoaded && awaitingVariants.length > 0"
            class="mb-2 flex items-start shadow-md" :class="{ 'cursor-wait': loading }">
            Create variants for all
          </Button>
          <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
            <Table.Thead variant="dark" class="text-xs">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">OPTION NAME</Table.Th>
                <Table.Th class="whitespace-nowrap text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="!dataLoaded" class="intro-x">
                <Table.Td colspan="5" class="py-0 px-0">
                  <TableLoading />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-if="awaitingVariants.length == 0 && dataLoaded" class="intro-x">
                <Table.Td colspan="5" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>

              <Table.Tr class="cursor-pointer" v-for="awaitingVariant in awaitingVariants" :key="awaitingVariant.ids">
                <Table.Td>
                  {{ awaitingVariant.display }}
                </Table.Td>
                <Table.Td>
                  <div class="flex items-center justify-center">
                    <NuxtLink class="flex text-pending text-center cursor-pointer" @click="async (event) => {
                      await create(awaitingVariant.ids);
                    }
                      ">
                      <Lucide icon="PlusSquare" class="w-4 h-4 mr-1" />
                      Create
                      <span class="hidden">Create</span>
                    </NuxtLink>
                  </div>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
