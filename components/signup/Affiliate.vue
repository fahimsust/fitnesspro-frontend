<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SelectField, SubmitButton } from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props);
const {
  accountAffiliate,
  saveAffiliate,
  errors,
  loading,
} = useAccount();
const affiliate = await accountAffiliate();
let form = reactive({
  affiliate_id: null,
});

const validateAndCreate = async () => {
  await saveAffiliate(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await accountAffiliate();
  }
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Affiliate</div>
  </div>
  <div class="px-5 pt-3 mt-5 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="grid grid-cols-12 gap-2 mt-3 gap-y-2">
      <div class="col-span-12 intro-y sm:col-span-12" v-if="!affiliate">
        <InputField name="affiliate_id" v-model="form" :error="errors.affiliate_id" title="Affiliate Id" :required="true"
          type="number" />
      </div>
      <div v-if="!affiliate" class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Save" :createFunction="validateAndCreate" :loading="loading" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-12 bg-white shadow-sm rounded-lg p-5" v-if="affiliate">
        <div class="text-lg font-semibold mb-3">{{ affiliate.name }}</div>
        <div class="flex items-center text-gray-500">
          <Lucide icon="Mail" class="w-4 h-4 mr-2 text-blue-500" />
          {{ affiliate.email }}
        </div>
      </div>


      <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Next" :createFunction="() => { goToStep(7) }" :loading="loading" />
      </div>

    </div>
  </div>
</template>
