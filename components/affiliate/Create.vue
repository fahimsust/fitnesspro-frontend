<script setup lang="ts">
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import { InputField, SelectField, SubmitButton, CancelButton } from "~/components/form";

const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Boolean,
  },
});

const { createAffiliate, errors, loading, affiliateLevels } = useAffiliates();
let form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  account_id: "",
  affiliate_level_id: "",
});
const { setSlideover, modelValue: slideover } = toRefs(props);
const affiliateValidationAndCraete = async () => {
  await createAffiliate(form);
  validationFocus(form, errors);
};
let affiliateLevel:any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  affiliateLevel = await affiliateLevels();
  dataLoaded.value = true
});
</script>
<template>
  <Slideover backdrop="static" :open="slideover" @close="() => {
    setSlideover(false);
  }
    ">
    <Slideover.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setSlideover(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Create Affiliate</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField :submit-function="affiliateValidationAndCraete" name="name" v-model="form" :error="errors.name"
            title="Name" />
        </div>

        <div class="mt-3">
          <InputField :submit-function="affiliateValidationAndCraete" name="email" type="email" v-model="form"
            :error="errors.email" title="Email" placeholder="xxx@xxx.com" />
        </div>

        <div class="mt-3">
          <InputField :submit-function="affiliateValidationAndCraete" name="password" type="password" v-model="form"
            :error="errors.password" title="Password" />
        </div>
        <div class="mt-3">
          <InputField name="password_confirmation" :submit-function="affiliateValidationAndCraete" type="password"
            v-model="form" :error="errors.password_confirmation" title="Password Confirmation" />
        </div>
        <div class="mt-3">
          <InputField name="account_id" :submit-function="affiliateValidationAndCraete" v-model="form"
            :error="errors.account_id" title="Account Id" />
        </div>
        <div class="mt-3" v-if="dataLoaded">
          <SelectField :options="affiliateLevel" :submit-function="affiliateValidationAndCraete" name="affiliate_level_id"
            v-model="form" :error="errors.affiliate_level_id" title="Rate Level" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="affiliateValidationAndCraete" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
