<script lang="ts" setup>
import { toRefs } from "vue";
import { SubmitButton,CheckBoxField,SelectField } from "~/components/form";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { FormLabel,FormInline } from "~/components/enigma/base-components/Form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
const route = useRoute();
const { modelValue: setting } = toRefs(props);
const idParem = parseInt(route.params.id.toString());

const { errors, loading, updateAllowOrdering } = useAllowOrdering();
const { getSiteSetting } = useSiteSetting();

const options = [
  { 'id': 1, 'name': 'In Stock' },
  { 'id': 2, 'name': 'Out of Stock' },
  { 'id': 3, 'name': 'On Order' },
  { 'id': 4, 'name': 'Discontinued' },
  { 'id': 5, 'name': 'Low Stock' },                                                                   
]
const cart_addtoactions = [
  { 'id': "0", 'name': 'Forward to Cart Page' },
  { 'id': '1', 'name': 'Show Popup' },

]

let form = reactive({
  cart_allowavailability: setting.value ? setting.value.cart_allowavailability ? setting.value.cart_allowavailability : "" : [],
  cart_orderonlyavailableqty: setting.value ? setting.value.cart_orderonlyavailableqty : false,
  cart_addtoaction: setting.value ? setting.value.cart_addtoaction : 0,
});
const emit = defineEmits(["update:modelValue"]);
const siteSettingValidationAndUpdate = async () => {
  await updateAllowOrdering(form, idParem);
  validationFocus(form, errors);
  const updatedSiteSetting = await getSiteSetting(idParem);
  emit("update:modelValue", updatedSiteSetting);
};
</script>
<template>
  <h2 class="pt-5 font-bold">Cart</h2>
  <hr class="my-2"/>
  <div class="mt-5">
    <FormLabel htmlFor="type">
      Allow Ordering of
    </FormLabel>
    <TomSelect v-model="form.cart_allowavailability" class="w-full" placeholder="Select Option" :multiple="true">
      <option :value="option.id" v-for="option in options" :key="option.id">
        {{ option.name }}
      </option>
    </TomSelect>
  </div>
  <div class="mt-5">
    <FormInline class="mt-5 first:mt-0 flex-wrap">
      <check-box-field name="cart_orderonlyavailableqty" v-model="form" :error="errors.cart_orderonlyavailableqty"
        title="Max. Qty Allowed to Order Limited by Stock Qty" :formInline="true" />
    </FormInline>
  </div>
  <div class="mt-5">
    <SelectField
      :options="cart_addtoactions"
      name="cart_addtoaction"
      :hasDefault=" false"
      :submit-function="siteSettingValidationAndUpdate"
      v-model="form"
      :error="errors.cart_addtoaction"
      title="After Add to Cart"
    />
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteSettingValidationAndUpdate" :loading="loading" />
  </div>
</template>
