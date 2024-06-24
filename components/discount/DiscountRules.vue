<script setup lang="ts">
import _ from "lodash";
import { reactive, onMounted } from "vue";
import { SelectField, SubmitButton, InputField } from "~/components/form";
import DiscountRule from "./condition/DiscountRule.vue";

const { getDiscountRules, errors, loading,dLoading, addDiscountRule,updateDiscountRuleMatch } =
  useDiscountRule();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const emit = defineEmits(["update:modelValue"]);
const { modelValue: discount } = toRefs(props);
const ruleOptions = [
  { id: 0, name: "All" },
  { id: 1, name: "Any" },
];
const ready = ref(false)
let rules:any = ref([])
let formAdd = reactive({
  discount_id: discount.value.id,
});
let formEdit = reactive({
  match_anyall: discount.value.match_anyall,
});

const refresh = async () => {
  await getDiscountRules(discount.value.id);
};
const updateDiscount = async () => {
  const resultData = await updateDiscountRuleMatch(formEdit,discount.value.id);
  emit("update:modelValue", resultData);
};

const validateAndCreate = async () => {
  await addDiscountRule(formAdd);
  validationFocus(formAdd, errors);
  await getDiscountRules(discount.value.id);
};
onMounted(async () => {
  await nextTick();
  rules = await getDiscountRules(discount.value.id);
  ready.value = true;
});
</script>

<template>
  <div  v-if="!ready">
    <div class="rounded-lg box intro-y lg:mt-14">
      <TableLoading />
    </div>
  </div> 
  <div class="p-3" v-if="ready">
    <div class="mt-5 p-6 dark:bg-black/40 rounded-lg border-gray-100 border-2">
      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 intro-y md:col-span-6">
          <div class="flex items-center space-x-4">
              <!-- SelectField Component -->
              <SelectField
                  :hasDefault="false"
                  :options="ruleOptions"
                  name="match_anyall"
                  :runFunction="updateDiscount"
                  v-model="formEdit"
                  :error="errors.match_anyall"
                  title="Match"
                  :withAfterLabel="true"
                  after-label="Rules"
              />

              <!-- Loading Indicator -->
              <div v-if="dLoading" class="animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <SubmitButton
        buttonText="Create New Rule"
        :createFunction="validateAndCreate"
        :loading="loading"
      />
    </div>

    <div
      class="mt-3 p-6 dark:bg-black/40 rounded-lg border-gray-100 border-2"
      v-for="rule in rules"
    >
      <DiscountRule :rule="rule" :key="rule.id" :refresh="refresh" />
    </div>
  </div>
</template>
