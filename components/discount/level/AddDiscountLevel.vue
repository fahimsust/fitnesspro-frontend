<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, SelectField, CheckBoxField } from "~/components/form";
const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  }
});
const {
  createDiscountLevel,
  discountLevelApplyTo,
  discountLevelActionType,
  errors,
  loading
} = useDiscountLevel();
const { setModal, modalShow, refresh } = toRefs(props);
let levelApplyTo = ref([]);
let levelActionType = ref([]);
const { list } = useSites();
let sites = ref([]);
let form = reactive({
  name: null,
  apply_to: 0,
  action_type: 0,
  action_sitepricing: null,
  action_percentage: null,
  status: true,
});
const validateAndCreateDiscountLevel = async () => {
  await createDiscountLevel(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
    setModal.value(false);
  }
};
const dataLoaded:any = ref(false)
onMounted(async()=>{
  await nextTick();
  levelApplyTo = await discountLevelApplyTo();
  levelActionType = await discountLevelActionType();
  sites = await list()
  dataLoaded.value = true
})
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-4 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Discount Level</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 gap-y-3" v-if="dataLoaded">
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="validateAndCreateDiscountLevel" name="name" v-model="form" :error="errors.name"
              title="Name" :required="true" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <CheckBoxField name="status" v-model="form" :error="errors.status" title="Status" />
          </div>
          <div class="col-span-6 mt-3 xs:col-span-12">
            <SelectField :options="levelActionType" :hasDefault="false" :submit-function="validateAndCreateDiscountLevel"
              name="action_type" v-model="form" :error="errors.action_type" title="Type of Discount" />
          </div>
          <div class="col-span-6 mt-3 xs:col-span-12" v-if="form.action_type == 1">
            <SelectField :options="sites" :hasDefault="false" :submit-function="validateAndCreateDiscountLevel"
              name="action_sitepricing" v-model="form" :error="errors.action_sitepricing" title="Use Pricing from Site" />
          </div>
          <div class="col-span-6 mt-3 xs:col-span-12" v-if="form.action_type == 0">
            <InputField :submit-function="validateAndCreateDiscountLevel" name="action_percentage" v-model="form"
              :error="errors.action_percentage" title="Percentage Off	%" :required="true" />
          </div>
          <div class="col-span-6 mt-3 xs:col-span-12">
            <SelectField :options="levelApplyTo" :hasDefault="false" :submit-function="validateAndCreateDiscountLevel"
              name="apply_to" v-model="form" :error="errors.apply_to" title="Apply Discount Level to" />
          </div>

        </div>
      </Dialog.Description>
      <Slideover.Footer>
        <SubmitButton :createFunction="validateAndCreateDiscountLevel" :loading="loading" />
      </Slideover.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
