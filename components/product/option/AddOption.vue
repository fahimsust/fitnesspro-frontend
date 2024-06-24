<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import { InputField, SelectField, SubmitButton, CancelButton } from "~/components/form";
const route = useRoute();
const props = defineProps({
  setSlideover: {
    required: true,
    type: Function,
  },
  slideover: {
    required: true,
    type: Boolean,
  },
  refreshOption: {
    required: true,
    type: Function,
  },
});
const { productOptionTypes, addProductOption, errors, loading } = useProductOption();
const { setSlideover, slideover, refreshOption } = toRefs(props);

const idParem = parseInt(route.params.id.toString());

let form = reactive({
  name: null,
  display: null,
  type_id: null,
  product_id: idParem,
});

const optionValidationAndAdd = async () => {
  await addProductOption(form);
  await refreshOption.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setSlideover.value(false);
  }
};
let optionTypes:any = ref({})
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  optionTypes = await productOptionTypes();
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
        <h2 class="mr-auto text-base font-medium">Add Product Option</h2>
      </Slideover.Title>

      <Slideover.Description>
        <div>
          <InputField name="name" :submit-function="optionValidationAndAdd" type="text" v-model="form"
            :error="errors.name" title="Name" />
        </div>
        <div class="mt-3">
          <InputField name="display" :submit-function="optionValidationAndAdd" type="text" v-model="form"
            :error="errors.display" title="Display Name" />
        </div>

        <div class="mt-3" v-if="dataLoaded">
          <SelectField :submit-function="optionValidationAndAdd" :options="optionTypes" name="type_id" v-model="form"
            :error="errors.type_id" title="Type" />
        </div>
      </Slideover.Description>
      <Slideover.Footer>
        <CancelButton :cancelFunction="setSlideover" />
        <SubmitButton :createFunction="optionValidationAndAdd" :loading="loading" />
      </Slideover.Footer>
    </Slideover.Panel>
  </Slideover>
</template>
