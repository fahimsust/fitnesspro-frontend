<script lang="ts" setup>
import { toRefs } from "vue";
import { Slideover } from "~/components/enigma/base-components/Headless";
import { CancelButton, SelectField, SubmitButton } from "~/components/form";

const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideOver: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
  categoryRuleId: {
    required: true,
    type: Number
  }
});

interface Option {
  id: string;
  name: string;
}
const { setSlideover, slideOver, refresh, categoryRuleId } = toRefs(props);
const { addCategoryRuleCondition, errors, loading } = useCategoryRuleCondition();
const { attributeSets } = useProductType();
const { attributes } = useAttribute();
const { attributeOption } = useAttributeOption();

let form = reactive({
  matches: 0,
  set_id: null,
  attribute_id: null,
  value_id: null
});
const options = [
  { id: true, "name": "Match" },
  { id: false, "name": "Don't Match" }
]
const setId = ref(0)
const attributeId = ref(0)
let sets: any = ref([]);
let attributeList = ref([])
let attributeOptionList = ref([])
const setChange = async (id: number) => {
  setId.value = id
  attributeList = await attributes(id);
  attributeOptionList.value = []
}
const attributeChange = async (id: number) => {
  attributeId.value = id
  attributeOptionList = await attributeOption(attributeId.value);
}
const conditionValidationAndAdd = async () => {
  await addCategoryRuleCondition(form, categoryRuleId.value)
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
    setSlideover.value(false)
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  sets = await attributeSets();
  dataLoaded.value = true
});
</script>
<template>
  <Slideover backdrop="static" :open="slideOver" @close="() => {
      setSlideover(false);
    }
    ">
    <Slideover.Panel>
      <Slideover.Title>
        <h2 class="mr-auto text-base font-medium">Add Condition</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded">
          <div>
            <SelectField name="set_id" v-model="form" default-option="Select an Attribute Set" :error="errors.set_id"
              title="Attribute Set" :options="sets" :runFunction="setChange" />
          </div>
          <div class="mt-3">
            <SelectField name="attribute_id" v-model="form" default-option="Select an Attribute"
              :error="errors.attribute_id" title="Attribute" :options="attributeList" :runFunction="attributeChange" />
          </div>
          <div class="mt-3">
            <SelectField :key="attributeId" name="value_id" v-model="form" default-option="Select an Option"
              :error="errors.value_id" title="Option" option-title="display" :options="attributeOptionList" />
          </div>
          <div class="mt-3">
            <SelectField name="matches" v-model="form" default-option="Select" :error="errors.matches"
              title="Show products that" :options="options" />
          </div>
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="conditionValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
