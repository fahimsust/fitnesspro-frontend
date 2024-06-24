<script lang="ts" setup>
import { toRefs, type PropType } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { SelectField, SubmitButton } from "~/components/form";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { FormLabel } from "../enigma/base-components/Form";
import TomSelectField from "~/components/form/TomSelectField.vue";


interface Option {
  id: string;
  name: string;
}

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  accountTypes: {
    required: true,
    type: Array as PropType<Array<Option>>,
  }
});
const { modelValue: site, accountTypes } = toRefs(props);

const { getSite } = useSites();
const { errors, loading, updateSiteDefaultAccountType } = useDefaultAccountType();

const options = [
  { 'id': 'none', 'name': 'None' },
  { 'id': 'site', 'name': 'Site' },
  { 'id': 'catalog', 'name': 'Catalog' },
  { 'id': 'checkout', 'name': 'Checkout' },
]

let form = reactive({
  account_type_id: site.value.account_type_id == 0 ? null : site.value.account_type_id,
  requireLogin: site.value.require_login,
  required_account_types: site.value.required_account_types ? site.value.required_account_types : [],
});
const emit = defineEmits(["update:modelValue"]);
const siteValidationAndUpdate = async () => {
  await updateSiteDefaultAccountType(form, site.value.id);
  validationFocus(form, errors);
  const updatedSite = await getSite(site.value.id);
  emit("update:modelValue", updatedSite);
};
</script>
<template>
  <h2 class="pt-5 font-bold">Accounts</h2>
  <hr class="my-2" />
  <div class="mt-5">
    <SelectField :options="accountTypes" name="account_type_id" :submit-function="siteValidationAndUpdate" v-model="form"
      :error="errors.account_type_id" title="Default Account Type" />
  </div>
  <div class="mt-5">
    <SelectField :options="options" name="requireLogin" :submit-function="siteValidationAndUpdate" v-model="form"
      :error="errors.requireLogin" title="Require Login For" />
  </div>
  <div class="mt-5">
    <FormLabel htmlFor="type">
      Allowed Account Types for Required Login
    </FormLabel>
    <TomSelect v-model="form.required_account_types" class="w-full" placeholder="Select Account Types" :multiple="true">
      <option :value="option.id" v-for="option in accountTypes" :key="option.id">
        {{ option.name }}
      </option>
    </TomSelect>
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="siteValidationAndUpdate" :loading="loading" />
  </div>
</template>
