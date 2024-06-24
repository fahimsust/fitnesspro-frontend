<script lang="ts" setup>
import { SelectField, SubmitButton } from "~/components/form";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { FormLabel, FormInline } from "~/components/enigma/base-components/Form";
const props = defineProps({
  performAction: {
    required: true,
    type: Function,
  },
  perform_option: {
    required: true,
    type: String,
  },
  errors: {
    required: true,
    type: Object,
  },
  ids: {
    required: true,
    type: Array,
  },
  loading: {
    required: true,
    type: Boolean,
  },
  modelValue: {
    required: true,
    type: Object,
  }
});
const { performAction, perform_option, errors, modelValue: obj, loading, ids } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);
const { attributeSets } = useProductType();
let setList: any = ref([])
const { attributes } = useAttribute();
let attributeList: any = ref([]);
const selected: any = ref({});
let form = reactive({
  'action_name': perform_option.value,
  'ids': ids.value,
  'set': obj.value != null && obj.value.set_id != null ? obj.value.set_id : null,
  'attributeList': obj.value != null && obj.value.set_id != null ? obj.value.set_id : [],
});
const validateAndSearch = async () => {
  const attributeList = [];
  for (let key in selected.value) {
    if (Array.isArray(selected.value[key])) {
      for (let key2 in selected.value[key]) {
        attributeList.push(selected.value[key][key2])
      }

    }
    else {
      attributeList.push(selected.value[key])
    }
  }
  form.attributeList = attributeList
  await performAction.value(form)
}
const keyDisclouse = ref(0)
const getAttributes = async (set_id: any) => {
  if (set_id) {
    let tempList = await attributes(set_id)
    for (let key in tempList.value) {
      selected.value[key] = ''
    }
    attributeList = tempList
    keyDisclouse.value = set_id
  }
  else {
    attributeList = []
    keyDisclouse.value = set_id
  }
}

watch(form, () => {
  emit("update:modelValue", form);
});
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  setList = await attributeSets()
  dataLoaded.value = true
});

</script>
<template>
  <div v-if="!dataLoaded">
    <TableLoading />
  </div>
  <SelectField :options="setList" v-if="dataLoaded" default-option="Select Attribue Set" name="set" v-model="form"
    :error="errors.set_id" title="Attribue Set" :run-function="getAttributes" />

  <div class="grid grid-cols-3 gap-6 mt-5" :key="keyDisclouse">
    <div v-for="(attribute, index) in attributeList" :key="attribute.id">
      <FormLabel htmlFor="type">
        {{ attribute.name }}
      </FormLabel>
      <TomSelect v-model="selected[index]" class="w-full" placeholder="Select Option"
        :multiple="attribute.type_id == 1 ? false : true">
        <option value="" v-if="attribute.type_id == 1" key="0">
          Select Option
        </option>
        <option :value="option.id" v-for="option in attribute.options" :key="option.id">
          {{ option.display }}
        </option>
      </TomSelect>
    </div>
  </div>
  <div class="mt-5 text-right">
    <SubmitButton :createFunction="validateAndSearch" :loading="loading" />
  </div>
</template>