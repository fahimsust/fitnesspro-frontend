<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField } from "~/components/form";

const props = defineProps({
  language_id: {
    required: true,
    type: Number,
  },
  attribute_id: {
    required: true,
    type: Number,
  },
  name:{
    required: true,
    type:String,
  }
});
const { updateTranslatedAttribute, getTranslatedAttribute, errors } = useAttribute();
const { language_id, attribute_id,name } = toRefs(props);

let form:any = reactive({});
const attributeValidationAndUpdate = async () => {
  await updateTranslatedAttribute(form, attribute_id.value, language_id.value);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  const setTranslation = await getTranslatedAttribute(
    attribute_id.value,
    language_id.value
  );
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
      :placeholder="name"
      v-model="form"
      :error="errors.name"
      :submit-function="attributeValidationAndUpdate"
      title="Name"
    />
    <div class="text-xs text-slate-500 mt-2 text-right">Press Enter For Save</div>
  </div>
</template>
