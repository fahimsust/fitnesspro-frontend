<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SelectField, SubmitButton } from "~/components/form"

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props)
const { membershipLevels, saveMembershipLevel, errors, loading, accountMembershipLevels } = useAccount()
const membershipLevel = await membershipLevels();
let form = reactive({
  level_id: membershipLevel.value.selected_level,
});

const selectedMembership = computed(() => {
  return membershipLevel.value.levels.find((level: { id: any; }) => level.id === form.level_id);
});
const currency = "$"

const validateAndCreate = async () => {
  await saveMembershipLevel(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    goToStep.value(3);
  }
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Membership Level</div>
  </div>
  <div class="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="grid grid-cols-12 gap-4 mt-5 gap-y-5">
      <div class="col-span-12 intro-y sm:col-span-12">
        <SelectField name="level_id" :options="membershipLevel.levels" v-model="form" :error="errors.level_id"
          title="Select Membership Level" :required="true" />
      </div>
      <!-- Display sale and reg_price for selected level_id -->
      <div v-if="selectedMembership"
        class="col-span-12 intro-y sm:col-span-12 mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div v-if="selectedMembership.product.pricing_for_current_site.onsale">
          Price : <del class="text-gray-500 text-sm line-through">{{ currency }}{{
            selectedMembership.product.pricing_for_current_site.price_reg }}</del>
          <span class="text-red-600 ml-4 font-semibold">{{ currency }}{{
            selectedMembership.product.pricing_for_current_site.price_sale }}</span>
        </div>

        <div v-else class="text-blue-600 font-semibold">
          Price : {{ currency }}{{ selectedMembership.product.pricing_for_current_site.price_reg }}
        </div>
      </div>



      <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Next" :createFunction="validateAndCreate" :loading="loading" />
      </div>
    </div>
  </div>
</template>
