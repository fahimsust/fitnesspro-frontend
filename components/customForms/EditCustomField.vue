<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import { FormLabel, FormInput } from "~/components/enigma/base-components/Form";
import Table from "~/components/enigma/base-components/Table";
import { Dialog, Disclosure } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, CheckBoxField, EditorField, SelectField } from "~/components/form";
import HorizontalCheckBoxField from "../form/HorizontalCheckBoxField.vue";
import UpdateTranslatedField from "./UpdateTranslatedField.vue";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modelShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Number,
  },
});

const { updateCustomField, getCustomField, errors, loading } = useCustomFields();
const { optionList, deleteCustomFieldOption, deleteConfirmationModalOption, updateCustomFieldOption, createCustomFieldOption, setDeleteId, errorsOption, loadingOption } = useCustomFieldOptions();
const { setModal, modelValue: fieldId, modelShow, refresh } = toRefs(props);
let customForm:any = ref({});
let fieldOptions:any = ref({});
const addOption = async () => {
  let data = reactive({ field_id: fieldId.value, display: "New Display ", value: "New Value" });
  await createCustomFieldOption(data);
  await optionList(fieldId.value);
};
const deleteFieldOption = async () => {
  await deleteCustomFieldOption(fieldId.value);
}
const is_change = ref(false);
const modifyCustomFieldOption = async (fieldName: string, value: any, customFieldOption: any) => {
  if (is_change.value == true) {
    let form: any = reactive({
      display: customFieldOption.display,
      value: customFieldOption.value,
      rank: customFieldOption.rank,
      field_id: customFieldOption.field_id
    });
    form[fieldName] = value;
    await updateCustomFieldOption(form, customFieldOption.id)
    is_change.value = false;
    await optionList(fieldId.value);
  }
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModalOption.value = value;
};
const types = [
  { id: 0, name: 'Textbox' },
  { id: 1, name: 'Textarea' },
  { id: 2, name: 'Checkboxes' },
  { id: 3, name: 'Radio Buttons' },
  { id: 4, name: 'Select Menu' },
  { id: 5, name: 'Select Menu (Multiple)' },
  { id: 6, name: 'Button' },
  { id: 7, name: 'Checkbox' },
  { id: 8, name: 'Number' }
]
const specs = [
  { value: 1, title: 'States List' },
  { value: 2, title: 'Countries List' },
  { value: 3, title: 'Custom List' },
]
let form:any = reactive({});
const { list } = useLanguages();
let languages:any = ref([]);

const fieldValidationAndUpdate = async () => {
  await updateCustomField(form, customForm.value.id);
  await refresh.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  customForm = await getCustomField(fieldId.value);
  fieldOptions = await optionList(fieldId.value);
  languages = await list();
  if (languages.value[0].id == 1) languages.value.shift();
  form = reactive({
    name: customForm.value.name,
    status: customForm.value.status,
    display: customForm.value.display,
    required: customForm.value.required,
    type: customForm.value.type,
    specs: customForm.value.specs,
    cssclass: customForm.value.cssclass
  });
  dataLoaded.value = true
});
</script>
<template>
  <Dialog backdrop="static" size="xl" :open="modelShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Edit Custom Field</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="overflow-y-auto col-span-12 h-96 p-3" v-if="dataLoaded">
          <Disclosure.Group variant="boxed">
            <Disclosure>
              <Disclosure.Button> English </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">

                <div>
                  <CheckBoxField name="status" v-model="form" :error="errors.status" title="Active" />
                </div>
                <div class="mt-3">
                  <InputField :auto-focus="true" name="name" type="text" v-model="form" :error="errors.name"
                    :submit-function="fieldValidationAndUpdate" title="Name" />
                </div>
                <div class="mt-3">
                  <EditorField name="display" v-model="form" :error="errors.display" title="Display" />
                </div>
                <div class="mt-3">
                  <SelectField :options="types" :submit-function="fieldValidationAndUpdate" name="type" v-model="form"
                    :error="errors.type" title="Type" />
                </div>
                <div class="mt-3">
                  <CheckBoxField name="required" v-model="form" :error="errors.required" title="Required" />
                </div>
                <div class="mt-3">
                  <InputField name="cssclass" type="text" v-model="form" :error="errors.cssclass"
                    :submit-function="fieldValidationAndUpdate" title="CSS Class" />
                </div>
                <div class="mt-3" v-if="form.type >= 2 && form.type < 6">
                  <HorizontalCheckBoxField :options="specs" name="specs" v-model="form" title="Options"
                    :error="errors.specs" />
                </div>
                <div class="p-4" v-if="form.type >= 2 && form.type < 6 && form.specs == 3">
                  <Button @click="addOption" variant="primary" class="mr-2 shadow-md">
                    Add Field Option
                  </Button>
                  <Table class="border-spacing-y-[10px] border-separate mt-2">
                    <Table.Thead variant="dark">
                      <Table.Tr>
                        <Table.Th class="whitespace-nowrap">DISPLAY</Table.Th>
                        <Table.Th class="whitespace-nowrap">VALUE</Table.Th>
                        <Table.Th class="whitespace-nowrap">RANK</Table.Th>
                        <Table.Th class="whitespace-nowrap"></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr v-if="fieldOptions.length == 0" class="intro-x">
                        <Table.Td colspan="4" class="py-0 px-0">
                          <AlertGray />
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr class="cursor-pointer" v-for="fieldOption in fieldOptions">
                        <Table.Td>
                          <FormInput type="text"
                            @blur="modifyCustomFieldOption('display', ($event.target as HTMLInputElement).value, fieldOption)"
                            @change="is_change = true" v-model="fieldOption.display" />
                        </Table.Td>
                        <Table.Td>
                          <FormInput type="text"
                            @blur="modifyCustomFieldOption('value', ($event.target as HTMLInputElement).value, fieldOption)"
                            @change="is_change = true" v-model="fieldOption.value" />
                        </Table.Td>
                        <Table.Td>
                          <FormInput type="number"
                            @blur="modifyCustomFieldOption('rank', ($event.target as HTMLInputElement).value, fieldOption)"
                            @change="is_change = true" v-model="fieldOption.rank" />
                        </Table.Td>
                        <Table.Td>
                          <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                            event.preventDefault();
                            setDeleteId(fieldOption.id);
                            setConfirmationModal(true);
                          }
                            ">
                            <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                            <span class="hidden">Remove</span>
                          </NuxtLink>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                <div class="mt-5 text-right">
                  <SubmitButton :createFunction="fieldValidationAndUpdate" :loading="loading" />
                </div>
              </Disclosure.Panel>
            </Disclosure>
            <Disclosure v-for="language in languages" :key="language.id">
              <Disclosure.Button>
                {{ language.name }}
              </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <UpdateTranslatedField :field_id="customForm.id" :language_id="language.id"
                  :display="customForm.display" />
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <CancelButton button-text="done" :cancelFunction="setModal" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <Confirmation v-model="deleteConfirmationModalOption" buttonStringMain="Remove"
    subHeader="Do you want to remove this option?" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    :functionToRun="deleteFieldOption" />
</template>
