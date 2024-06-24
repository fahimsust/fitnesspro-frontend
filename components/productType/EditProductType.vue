<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { FormLabel } from "~/components/enigma/base-components/Form";
const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  refreshType: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});
const {
  updateProductTypes,
  errors,
  loading,
  taxRules,
  attributeSets,
  addProductTypeAttribteSet,
  addProductTypetaxRule,
} = useProductType();
const { setSlideover, modelValue: productType, slideover, refreshType } = toRefs(props);

let attributeSetList: any = ref([]);
let taxRulesList: any = ref([]);


let form = reactive({
  name: productType.value.name,
});

const typeValidationAndUpdate = async () => {
  await updateProductTypes(form, productType.value.id);
  await refreshType.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setSlideover.value(false);
  }
};
const setValueTaxRule = async (obj: any) => {
  if (obj.selectedTaxRules == "") {
    obj.selectedTaxRules = [];
  }
  obj.selected = Array.isArray(obj.selectedTaxRules)
    ? obj.selectedTaxRules
    : [obj.selectedTaxRules];
  let form = reactive({
    rule_ids: obj.selectedTaxRules,
  });
  await addProductTypetaxRule(form, obj.id);
  validationFocus(form, errors);
};
const setValueattributeSets = async (obj: any) => {
  if (obj.selectedAttributeSet == "") {
    obj.selectedAttributeSet = [];
  }
  obj.selected = Array.isArray(obj.selectedAttributeSet)
    ? obj.selectedAttributeSet
    : [obj.selectedAttributeSet];
  let form = reactive({
    set_ids: obj.selectedAttributeSet,
  });
  await addProductTypeAttribteSet(form, obj.id);
  await refreshType.value();
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  attributeSetList = await attributeSets();
  taxRulesList = await taxRules();
  dataLoaded.value = true
})
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
        <h2 class="mr-auto text-base font-medium">Edit Product Type</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField name="name" type="text" v-model="form" :submit-function="typeValidationAndUpdate"
            :error="errors.name" title="Name" />
        </div>
        <div class="mt-3" v-if="!dataLoaded">
          <div class="rounded-lg box intro-y lg:mt-0">
            <TableLoading />
          </div>
        </div> 
        <div class="mt-3" v-if="attributeSetList.length > 0 && dataLoaded">
          <FormLabel htmlFor="type">Attribute Sets</FormLabel>
          <TomSelect v-model="productType.selectedAttributeSet" class="w-full" placeholder="Select Attribute Set"
            :callBack="() => {
              setValueattributeSets(productType);
            }
              " :multiple="true">
            <option :value="option.id" v-for="option in attributeSetList" :key="option.id">
              {{ option.name }}
            </option>
          </TomSelect>
        </div>
        <div class="mt-3" v-if="taxRulesList.length > 0 && dataLoaded">
          <FormLabel htmlFor="type">Tax Rules</FormLabel>
          <TomSelect v-model="productType.selectedTaxRules" class="w-full" placeholder="Select Tax Rules" :callBack="() => {
            setValueTaxRule(productType);
          }
            " :multiple="true">
            <option :value="option.id" v-for="option in taxRulesList" :key="option.id">
              {{ option.name }}
            </option>
          </TomSelect>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="typeValidationAndUpdate" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
