<script setup lang="ts">
import { toRefs } from "vue";
import { InputField, SubmitButton, CancelButton, SelectField, CheckBoxField } from "~/components/form";
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  }
});
const {
  updateDiscountLevel,
  discountLevelApplyTo,
  discountLevelActionType,
  getDiscountLevel,
  errors,
  loading
} = useDiscountLevel();
const emit = defineEmits(["update:modelValue"]);
const { modelValue: discountLevel } = toRefs(props);
let levelApplyTo: any = ref([]);
let levelActionType: any = ref([]);
const { list } = useSites();
let sites: any = ref([]);
let form = reactive({
  name: discountLevel.value.name,
  apply_to: discountLevel.value.apply_to,
  action_type: discountLevel.value.action_type,
  action_sitepricing: discountLevel.value.action_sitepricing,
  action_percentage: discountLevel.value.action_percentage,
  status: discountLevel.value.status,
});
const validateAndUpdateDiscountLevel = async () => {
  await updateDiscountLevel(form, discountLevel.value.id);
  validationFocus(form, errors);
  const updatedDiscountLevel = await getDiscountLevel(discountLevel.value.id);
  emit("update:modelValue", updatedDiscountLevel);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  levelApplyTo = await discountLevelApplyTo();
  levelActionType = await discountLevelActionType();
  sites = await list()
  dataLoaded.value = true;
});
</script>

<template>
  <div class="p-1">
    <div class="grid grid-cols-12 gap-2" v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2" v-if="dataLoaded">
      <div class="col-span-6 xs:col-span-12">
        <InputField :submit-function="validateAndUpdateDiscountLevel" name="name" v-model="form" :error="errors.name"
          title="Name" :required="true" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <CheckBoxField name="status" v-model="form" :error="errors.status" title="Status" />
      </div>
      <div class="col-span-6 mt-3 xs:col-span-12">
        <SelectField :options="levelActionType" :hasDefault="false" :submit-function="validateAndUpdateDiscountLevel"
          name="action_type" v-model="form" :error="errors.action_type" title="Type of Discount" />
      </div>
      <div class="col-span-6 mt-3 xs:col-span-12" v-if="form.action_type == 1">
        <SelectField :options="sites" :hasDefault="false" :submit-function="validateAndUpdateDiscountLevel"
          name="action_sitepricing" v-model="form" :error="errors.action_sitepricing" title="Use Pricing from Site" />
      </div>
      <div class="col-span-6 mt-3 xs:col-span-12" v-if="form.action_type == 0">
        <InputField :submit-function="validateAndUpdateDiscountLevel" name="action_percentage" v-model="form"
          :error="errors.action_percentage" title="Percentage Off	%" :required="true" />
      </div>
      <div class="col-span-6 mt-3 xs:col-span-12">
        <SelectField :options="levelApplyTo" :hasDefault="false" :submit-function="validateAndUpdateDiscountLevel"
          name="apply_to" v-model="form" :error="errors.apply_to" title="Apply Discount Level to" />
      </div>
      <div class="col-span-6 mt-12 xs:col-span-12 xs:mt-3">
        {{ discountLevel.products_count }} product(s) assigned to this discount level
      </div>
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndUpdateDiscountLevel" :loading="loading" />
    </div>
  </div>
</template>
