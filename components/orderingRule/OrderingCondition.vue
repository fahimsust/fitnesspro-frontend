<script lang="ts" setup>
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSelect } from "~/components/enigma/base-components/Form";
import { Disclosure } from "~/components/enigma/base-components/Headless";
import AccountTypes from "./AccountTypes.vue";
import Specilities from "./Specilities.vue";

import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  condition: {
    required: true,
    type: Object,
  },
  errors: {
    required: true,
    type: Object,
  },
  modifyCondition: {
    required: true,
    type: Function,
  },
  setConfirm: {
    required: true,
    type: Function,
  },
});
const { condition: gcondition, modifyCondition, setConfirm } = toRefs(props);
const any_all = [
  { id: "any", name: "Any" },
  { id: "all", name: "All" },
];
const condition = ref(gcondition.value);
const match = ref(condition.value.any_all);
const disclosureKey = ref(0);

const updateCondition = (event: any) => {
  let form = reactive({
    any_all: event.target.value,
  });
  modifyCondition.value(form, condition.value.id);
};
const refreshData = async () => {
  const conditions = await list(idParem);
  conditions.value.forEach(function (value: any) {
    if (value.id == condition.value.id) {
      condition.value = value;
    }
  });
  disclosureKey.value = disclosureKey.value + 1;
};
const addConditionItem = async (item_id: number) => {
  let form = reactive({
    item_id: item_id,
  });
  await createConditionItem(condition.value.id, form);
  await refreshData();
};
const deleteAndReload = async (item_id: number, condition_id: number) => {
  await deleteConditionItem(condition_id, item_id);
  await refreshData();
};
const { createConditionItem, deleteConditionItem } = useOrderingConditionItem();
const { list } = useOrderingCondition();
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const modalShowSpecility = ref(false);
const setModalSpecility = (value: boolean) => {
  modalShowSpecility.value = value;
};
const modalShowAccountType = ref(false);
const setModalAccountType = (value: boolean) => {
  modalShowAccountType.value = value;
};
</script>
<template>
  <Disclosure>
    <Disclosure.Button>
      <div class="flex flex-wrap items-center col-span-12 gap-4 mt-2 intro-y sm:flex-nowrap">
        <div>
          {{
            condition.type == "required_account_specialty"
            ? "Required Account Specialty(s) in Condition"
            : "Required Account Type(s) in Condition"
          }}
        </div>
        <div class="mt-1 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
          <div class="relative text-slate-500">
            <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  setConfirm(condition.id);
                  event.stopPropagation();
                }
                ">
              <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
              <span class="hidden">Remove</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Disclosure.Button>
    <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
      <div class="flex flex-wrap items-center col-span-12 gap-4 mt-2 intro-y sm:flex-nowrap">
        <FormSelect class="w-44" v-model="match" @change="updateCondition($event)">
          <option :value="option.id" v-for="option in any_all" :key="option.id">
            {{ option.name }}
          </option>
        </FormSelect>
      </div>

      <div class="overflow-x-auto mt-3">
        <Button variant="primary" v-if="condition.type == 'required_account_type'" @click="setModalAccountType(true)"
          class="mr-2 shadow-md">
          Add Account Type

        </Button>
        <Button variant="primary" v-if="condition.type == 'required_account_specialty'" @click="setModalSpecility(true)"
          class="mr-2 shadow-md">
          Add Account Specialty
        </Button>
        <Table class="border-spacing-y-[10px] border-separate mt-2 hover">
          <Table.Thead variant="dark" class="text-xs">
            <Table.Tr>
              <Table.Th class="whitespace-nowrap">NAME</Table.Th>
              <Table.Th class="whitespace-nowrap"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="(condition.type == 'required_account_specialty' &&
                condition.specialties.length == 0) ||
              (condition.type == 'required_account_type' &&
                condition.account_types.length == 0)
              " class="intro-x">
              <Table.Td colspan="2" class="py-0 px-0">
                <AlertGray />
              </Table.Td>
            </Table.Tr>
            <Table.Tr class="intro-x" v-for="specility in condition.specialties"
              v-if="condition.type == 'required_account_specialty'">
              <Table.Td>
                {{ specility.name }}
              </Table.Td>

              <Table.Td>
                <div class="flex items-center justify-center">
                  <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                      deleteAndReload(specility.id, condition.id);
                      event.stopPropagation();
                    }
                    ">
                    <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                    <span class="hidden">Remove</span>
                  </NuxtLink>
                </div>
              </Table.Td>
            </Table.Tr>
            <Table.Tr class="intro-x" v-for="account_type in condition.account_types"
              v-if="condition.type == 'required_account_type'">
              <Table.Td>
                {{ account_type.name }}
              </Table.Td>

              <Table.Td>
                <div class="flex items-center justify-center">
                  <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                      deleteAndReload(account_type.id, condition.id);
                      event.stopPropagation();
                    }
                    ">
                    <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                    <span class="hidden">Remove</span>
                  </NuxtLink>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <AccountTypes :key="condition.id" :modal-show="modalShowAccountType" :set-model="setModalAccountType"
        :add="addConditionItem" :condition_id="condition.id" v-if="condition.id > 0" />
      <Specilities :key="condition.id" :modal-show="modalShowSpecility" :set-model="setModalSpecility"
        :condition_id="condition.id" :add="addConditionItem" v-if="condition.id > 0" />
    </Disclosure.Panel>
  </Disclosure>
</template>
