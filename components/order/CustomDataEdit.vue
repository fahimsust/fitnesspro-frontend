<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";
import { FormTextarea, FormLabel, FormSwitch, FormSelect, FormInput, FormCheck } from "~/components/enigma/base-components/Form";

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
  },
  customForm: {
    required: true,
    type: Object,
  },
});
const { updateOrderCustomForm, errors, loading } = useOrderCustomForms();
const { setModal, modalShow, refresh, customForm } = toRefs(props);

let form = reactive({
  form_id: customForm.value.form_id,
  product_id: customForm.value.product_id,
  product_type_id: customForm.value.product_type_id,
  form_values: customForm.value.form_values,
});

const getCustomFormValue = (customForm: any, section: any, field: any) => {
  if (customForm.product && customForm.product_type) {
    if (
      customForm.form_values &&
      customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()]
      && customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()]
      && customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()][field.id.toString()]
    ) {
      return customForm.form_values[customForm.form_id.toString() + "-" + customForm.product_id.toString() + "-" + customForm.product_type_id.toString()][section.id.toString()][field.id.toString()];
    }
  }
  else {

    if (
      customForm.form_values &&
      customForm.form_values[customForm.form_id.toString()] &&
      customForm.form_values[customForm.form_id.toString()][section.id.toString()] &&
      customForm.form_values[customForm.form_id.toString()][section.id.toString()][field.id.toString()]
    ) {
      return customForm.form_values[customForm.form_id.toString()][section.id.toString()][field.id.toString()]
    }
  }
  return "";
}

const formValues: any = ref({});
if (customForm.value.form.sections) {
  customForm.value.form.sections.forEach((section: any) => {
    if (section.fields) {
      section.fields.forEach((field: any) => {
        if (field) {
          if (formValues.value[section.id] == undefined) {
            formValues.value[section.id] = {}
          }
          formValues.value[section.id][field.id] = getCustomFormValue(customForm.value, section, field)
        }
      })
    }
  })
}

const validationAndAdd = async () => {
  let form_values: any = {}
  if (customForm.value.form.sections) {
    customForm.value.form.sections.forEach((section: any) => {
      if (section.fields) {
        section.fields.forEach((field: any) => {
          if (field) {
            if (formValues.value[section.id][field.id]) {
              if (customForm.value.product && customForm.value.product_type) {
                if (form_values[customForm.value.form_id.toString() + "-" + customForm.value.product_id.toString() + "-" + customForm.value.product_type_id.toString()] == undefined) {
                  form_values[customForm.value.form_id.toString() + "-" + customForm.value.product_id.toString() + "-" + customForm.value.product_type_id.toString()] = {}
                }
                if (form_values[customForm.value.form_id.toString() + "-" + customForm.value.product_id.toString() + "-" + customForm.value.product_type_id.toString()][section.id.toString()] == undefined) {
                  form_values[customForm.value.form_id.toString() + "-" + customForm.value.product_id.toString() + "-" + customForm.value.product_type_id.toString()][section.id.toString()] = {}
                }
                form_values[customForm.value.form_id.toString() + "-" + customForm.value.product_id.toString() + "-" + customForm.value.product_type_id.toString()][section.id.toString()][field.id.toString()] = formValues.value[section.id][field.id]
              }
              else {
                if (form_values[customForm.value.form_id.toString()] == undefined) {
                  form_values[customForm.value.form_id.toString()] = {}
                }
                if (form_values[customForm.value.form_id.toString()][section.id.toString()] == undefined) {
                  form_values[customForm.value.form_id.toString()][section.id.toString()] = {}
                }
                form_values[customForm.value.form_id.toString()][section.id.toString()][field.id.toString()] = formValues.value[section.id][field.id]
              }
            }
          }
        })
      }
    })
  }
  form.form_values = form_values
  await updateOrderCustomForm(form, customForm.value.order_id, customForm.value.id);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
    setModal.value(false)
  }
};
const toggleCheckbox = (sectionId: any, fieldId: any, value: any) => {
  const isChecked = isArrayAndIncludes(formValues.value[sectionId][fieldId], value);
  if (isChecked) {
    // Remove value if already selected
    formValues.value[sectionId][fieldId] = formValues.value[sectionId][fieldId].filter((item: string) => item !== value);
  } else {
    // Add value if not already selected
    if (!Array.isArray(formValues.value[sectionId][fieldId])) {
      formValues.value[sectionId][fieldId] = []
    }
    formValues.value[sectionId][fieldId].push(value);
  }
};
const isArrayAndIncludes = (array: any, value: any) => {
  // Ensure array is initialized
  if (!Array.isArray(array)) {
    array = [];
  }
  // Check if value is included in the array
  return array.includes(value);
};
</script>
<template>
  <Dialog backdrop="static" size="xl" :open="modalShow" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Edit Custom Data {{ customForm.form.name }}</h2>
      </Dialog.Title>

      <Dialog.Description class="p-5 max-h-[75vh] overflow-auto">
        <div v-for="section in customForm.form.sections" :key="section.id"
          class="mt-2 border-2 border-gray-200 dark:border-gray-800 p-3">
          <FormLabel class="font-medium">
            {{ section.title }}
          </FormLabel>
          <div v-for="field in section.fields" :key="field.id" class="mt-3">
            <FormLabel>{{ field.display }}</FormLabel>
            <div v-if="field.type === 0">
              <FormInput type="text" v-model="formValues[section.id][field.id]" />
            </div>
            <div v-if="field.type === 1">
              <FormTextarea model="formValues[section.id][field.id]" />
            </div>
            <div v-if="field.type === 2">
              <div v-for="value in field.options" :key="value.id" class="ml-4">
                <label class="flex items-center text-gray-700">
                  <input type="checkbox" :checked="isArrayAndIncludes(formValues[section.id][field.id], value.display)"
                    @change="toggleCheckbox(section.id, field.id, value.display)" class="mr-2 text-gray-800">
                  <span class="text-gray-800 dark:text-white">{{ value.display }}</span>
                </label>
              </div>
            </div>
            <div v-if="field.type === 4">
              <FormSelect v-model="formValues[section.id][field.id]">
                <option v-for="value in field.options" :key="value.id" :value="value.display">
                  {{ value.display }}
                </option>
              </FormSelect>
            </div>
            <div v-if="field.type === 3 || field.type === 6">
              <div v-for="value in field.options" :key="value.id" class="ml-4">
                <label class="flex items-center text-gray-700">
                  <input type="radio" v-model="formValues[section.id][field.id]" :value="value.display" class="mr-2">
                  <span class="text-gray-800 dark:text-white">{{ value.display }}</span>
                </label>
              </div>
            </div>

            <div v-if="field.type === 5">
              <FormSelect v-model="formValues[section.id][field.id]" multiple>
                <option v-for="value in field.options" :key="value.id" :value="value.display">
                  {{ value.display }}
                </option>
              </FormSelect>
            </div>

          </div>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="validationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
