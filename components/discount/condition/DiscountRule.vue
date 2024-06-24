<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { SelectField, InputField } from "~/components/form";
import Button from "~/components/enigma/base-components/Button";
import DiscountCondition from "./DiscountCondition.vue"

const props = defineProps({
  rule: {
    required: true,
    type: Object
  },
  refresh: {
    required: true,
    type: Function
  },
});
const { rule, refresh } = toRefs(props);



const { deleteDiscountRule, getDiscountRule, deleteConfirmationModal, errors, setDeleteId, updateDiscountRule } = useDiscountRule();
const conditionKey = ref(1)
const conditionKeyMain = ref(conditionKey.value.toString() + "-" + rule.value.id.toString())
const ruleValue = ref(rule.value)
const refreshSingle = async () => {
  const newRuleValue = await getDiscountRule(rule.value.id);
  ruleValue.value = newRuleValue.value;
}
const ruleOptions = [{ id: 0, name: 'All' }, { id: 1, name: 'Any' }];
let formEdit = reactive({
  rank: ruleValue.value.rank,
  match_anyall: ruleValue.value.match_anyall,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if (updated.value == true) {
    await updateDiscountRule(formEdit, rule.value.id);
    validationFocus(formEdit, errors);
    await refreshSingle();
    updated.value = false
  }

};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const deleteRuleAndReload = async () => {
  await deleteDiscountRule();
  refresh.value()
}
watch(() => ruleValue.value, async (newVal) => {
  if (newVal) {
    conditionKey.value += 1;
    conditionKeyMain.value = conditionKey.value.toString() + "-" + rule.value.id.toString()
  }
});
</script>

<template>
  <h3 class="mt-3 mb-2 text-lg font-medium leading-none text-success">Rule #{{ ruleValue.id }}</h3>
  <div class="gap-2 grid grid-cols-12 md:gap-8">
    <div class="col-span-12 md:col-span-10">
      <div class="gap-2 grid grid-cols-12 md:gap-8">
        <div class="col-span-12 intro-y md:col-span-4">
          <div class="flex items-center space-x-4">
            <SelectField :hasDefault="false" :options="ruleOptions" name="match_anyall" v-model="formEdit"
              :error="errors.match_anyall" title="Match" :runFunction="() => { updated = true; validateAndUpdate() }"
              after-label="Rules" :withAfterLabel="true" />
          </div>

        </div>
        <div class="col-span-12 intro-y md:col-span-4">
          <div class="flex items-center space-x-4">
            <InputField :blur="validateAndUpdate" :change="() => updated = true" type="number"
              :submitFunction="validateAndUpdate" name="rank" v-model="formEdit" :error="errors.rank" title="Rank" />
          </div>

        </div>
      </div>
    </div>
    <div class="col-span-12 md:col-span-2 md:text-right">
      <Button variant="danger" type="button" @click="() => {
        setDeleteId(rule.id);
        setConfirmationModal(true);
      }
        " class="w-24 mr-1 mt-7">
        Delete
      </Button>
    </div>
  </div>
  <DiscountCondition :key="conditionKeyMain" v-model="ruleValue" :refresh="refreshSingle" />
  <Confirmation buttonStringMain="Delete" v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId" sub-header="Do you really want to delete this discount rule?"
    :functionToRun="deleteRuleAndReload" />
</template>