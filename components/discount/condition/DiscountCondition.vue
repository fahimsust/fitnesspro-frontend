<script setup lang="ts">
import _ from "lodash";
import { reactive, onMounted } from "vue";
import { SelectField, SubmitButton } from "~/components/form";
import Button from "~/components/enigma/base-components/Button";

const { getDiscountConditionOptions, deleteDiscountCondition, deleteConfirmationModal, errors, loading, addDiscountCondition, setDeleteId, updateDiscountCondition } = useDiscountCondition();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object
  },
  refresh: {
    required: true,
    type: Function
  }
});
const ready = ref(false);
const { modelValue: rule, refresh } = toRefs(props);
let conditionOptions:any = ref([]);
let formAdd = reactive({
  condition_type_id: null,
  rule_id: rule.value.id,
});
const deleteConditionAndReload = async () => {
  await deleteDiscountCondition();
  refresh.value();
}
const validateAndCreate = async () => {
  await addDiscountCondition(formAdd);
  validationFocus(formAdd, errors);
  refresh.value();
};
const componentMap = shallowRef<{ [key: string]: any }>({});
const componentNameMap = ref<{ [key: string]: any }>({});

onMounted(async () => {
  await nextTick();
  conditionOptions = await getDiscountConditionOptions();
  for (const obj of conditionOptions.value) {
    if (!componentMap.value[obj.id]) {
      componentMap.value[obj.id] = defineAsyncComponent(() => import(/* @vite-ignore */`./dynamic/${obj.component_type}.vue`));
    }
    if (!componentNameMap.value[obj.id]) {
      componentNameMap.value[obj.id] = obj.name;
    }
  }
  ready.value = true;
});

const getComponent = (condition: any) => {
  return componentMap.value[condition.condition_type_id];
};
const getComponentName = (condition: any) => {
  return componentNameMap.value[condition.condition_type_id];
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
</script>

<template>
  <div v-if="!ready">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="p-3 mt-5  bg-blue-100 dark:bg-gray-800 rounded-lg" v-if="ready">
    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 intro-y md:col-span-6">
        <SelectField :options="conditionOptions" name="condition_type_id" v-model="formAdd"
          :error="errors.condition_type_id" title="Condition Type" />
      </div>
      <div class="col-span-12 intro-y md:col-span-6 mt-7">
        <SubmitButton buttonText="Create New Condition" :createFunction="validateAndCreate" :loading="loading" />
      </div>
    </div>
    <div class="mt-3 p-5 bg-blue-50 dark:bg-gray-700 rounded-lg" v-for="condition in rule.conditions">
      <h3 class="mt-3 mb-2 text-l font-medium leading-none text-success">Condition : {{ getComponentName(condition) }}
      </h3>
      <div class="gap-2 grid grid-cols-12 md:gap-8">
        <div class="col-span-12 md:col-span-10">
          <div class="gap-2 grid grid-cols-12 md:gap-8">
            <component :key="condition.id" :is="getComponent(condition)" :condition="condition" />
          </div>
        </div>
        <div class="col-span-12 md:col-span-2 md:text-right">
          <Button variant="danger" type="button" @click="() => {
            setDeleteId(condition.id);
            setConfirmationModal(true);
          }
            " class="w-24 mr-1 mt-7">
            Delete
          </Button>
        </div>
      </div>
    </div>

  </div>
  <Confirmation buttonStringMain="Delete" v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId" sub-header="Do you really want to delete this discount condition?"
    :functionToRun="deleteConditionAndReload" />
</template>
