<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  set_id: {
    required: true,
    type: Number,
  },
  name:{
    required: true,
    type:String,
  }
});
const {
  updateTranslatedAttributeSet,
  getTranslatedAttributeSet,
  errors,
  loading,
} = useAttributeSet();
const { language_id, set_id,name } = toRefs(props);
let form:any = reactive({});
const attributeSetValidationAndUpdate = async () => {
  await updateTranslatedAttributeSet(form, set_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const setTranslation = await getTranslatedAttributeSet(set_id.value, language_id.value);
  form = reactive({
    name: setTranslation.value != null ? setTranslation.value.name : "",
  });
  dataLoaded.value = true
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="mt-5" v-if="dataLoaded">
    <InputField
      :withLabel="false"
      name="name"
      v-model="form"
      :error="errors.name"
      :placeholder="name"
      :submit-function="attributeSetValidationAndUpdate"
      title="Name"
    />
    <div class="text-xs text-slate-500 mt-2 text-right">Press Enter For Save</div>
  </div>
</template>
