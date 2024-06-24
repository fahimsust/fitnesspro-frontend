<script lang="ts" setup>
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";
import Alert from "~/components/enigma/base-components/Alert";
import { ref } from "vue";
import { FormLabel, FormInput } from "~/components/enigma/base-components/Form";
import { FormSwitch } from "~/components/enigma/base-components/Form";
import SearchFormField from "./SearchFormField.vue";
import EditCustomField from "./EditCustomField.vue";
import EditSectionTranslation from "./EditSectionTranslation.vue";

const {
  list,
  createCustomFormSection,
  updateCustomFormSection,
  deleteConfirmationModal,
  deleteCustomFormSection,
  setDeleteId,
} = useCustomFormSections();

const {
  createSectionField,
  updateSectionField,
  deleteConfirmationModalForm,
  deleteSectionField,
  setArchivedId,
} = useSectionFields()


const route = useRoute();
const idParam = parseInt(route.params.id.toString());
let customFormSections:any = ref([]);
const add = async () => {
  let data = reactive({ form_id: idParam, rank: 1, title: "New Form Section" });
  await createCustomFormSection(data);
  await list(idParam);
};
const refreshData = async () => {
  await list(idParam);
};
const getCustomFieldCount = () => {
  return customFormSections.value.reduce((count: any, customFormSection: any) => count + customFormSection.fields.length, 0);
};
const addField = async (section_id: any) => {
  const number = getCustomFieldCount() + 1
  let data = reactive({ section_id: section_id, display: "New Field Display " + number, name: "New Field Name " + number });
  await createSectionField(data);
  await list(idParam);
};
const addFromCustomField = async (name: string, sectionId: number) => {
  let data = reactive({ section_id: sectionId, display: name, name: name });
  await createSectionField(data);
  await list(idParam);
};
const removeCustomForm = () => {
  deleteCustomFormSection(idParam);
};
const removeCustomFormField = async () => {
  await deleteSectionField(idParam);
  await list(idParam);
};
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const setDeleteConfirmationModalForm = async (value: boolean) => {
  deleteConfirmationModalForm.value = value;
};
const section:any = ref({id:0})

const modalShowSection = ref(false)
const setModalSection=(value: boolean)=>{
  modalShowSection.value = value
}
const setSection=(sectionData: object)=>{
  section.value = sectionData
  modalShowSection.value = true;
}

const sectionId = ref(0)
const modalShow = ref(false);
const setModal = (value: boolean, section_id: number) => {
  sectionId.value = section_id
  modalShow.value = value
};

const customField = ref(0)
const modalShowField = ref(false);
const setModalField = (value: boolean, field_id: number) => {
  customField.value = field_id
  modalShowField.value = value
};
const setModalFieldOnly = (value: boolean) => {
  modalShowField.value = value
};


const is_change = ref(false);

const modifyFormSectionField = async (fieldName: string, value: any, formSectionField: any) => {
  if (is_change.value == true) {
    let form: any = reactive({
      required: formSectionField.required,
      rank: formSectionField.rank,
      new_row: formSectionField.new_row,
    });
    if (fieldName == 'required' || fieldName == 'new_row') {
      form[fieldName] = !value;
    }
    else {
      form[fieldName] = value;
    }
    await updateSectionField(form, formSectionField.id)
    is_change.value = false;
    await list(idParam);
  }
};
const modifyCustomFormSection = async (fieldName: string, value: any, customFormSection: any) => {
  if (is_change.value == true) {
    let form: any = reactive({
      title: customFormSection.title,
      rank: customFormSection.rank,
      form_id: customFormSection.form_id,
    });

    form[fieldName] = value;
    await updateCustomFormSection(form, customFormSection.id)
    is_change.value = false;
    await list(idParam);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  customFormSections = await list(idParam);
  dataLoaded.value = true
});
</script>
<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="col-span-12 lg:col-span-9" v-if="dataLoaded">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y mt-5">
      <Button @click="() => add()" variant="primary" class="mr-2 shadow-md">
        Add Section
      </Button>
      <div class="overflow-x-auto mt-5">

        <AlertGray v-if="customFormSections.length == 0" />
        <div class="p-4 border" v-if="customFormSections.length > 0" v-for="customFormSection in customFormSections"
          :key="customFormSection.id">
          <Alert variant="primary" class="mb-2">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">
                Title
              </div>
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">
                Rank
              </div>
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">

              </div>
            </div>
          </Alert>
          <Alert variant="secondary" class="mb-2">
            <div class="grid grid-cols-12 gap-4 gap-y-3">
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">
                <FormInput type="text"
                  @blur="modifyCustomFormSection('title', ($event.target as HTMLInputElement).value, customFormSection)"
                  @change="is_change = true" v-model="customFormSection.title" />
              </div>
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">
                <FormInput type="number"
                  @blur="modifyCustomFormSection('rank', ($event.target as HTMLInputElement).value, customFormSection)"
                  @change="is_change = true" v-model="customFormSection.rank" />
              </div>
              <div class="col-span-4 intro-y md:col-span-4 lg:col-span-4">
                <Button variant="danger" size="sm" rounded @click="(event) => {
                  event.preventDefault();
                  setDeleteId(customFormSection.id);
                  setConfirmationModal(true);
                }" class="w-24 mb-2 mr-2">Delete</Button>

                <Button variant="primary"  size="sm" class="w-24 mb-2 mr-1" rounded @click="(event) => {
                  setSection(customFormSection);
                }" >Translation</Button>

              </div>
            </div>

          </Alert>
          <div class="p-4">
            <Button @click="() => addField(customFormSection.id)" variant="primary" class="mr-2 shadow-md">
              Add New Field
            </Button>
            <Button @click="() => setModal(true, customFormSection.id)" variant="primary" class="mr-2 shadow-md">
              Add Existing Field
            </Button>
            <Table class="border-spacing-y-[10px] border-separate mt-2">
              <Table.Thead variant="dark">
                <Table.Tr>
                  <Table.Th class="whitespace-nowrap">DISPLAY</Table.Th>
                  <Table.Th class="whitespace-nowrap">NAME</Table.Th>
                  <Table.Th class="whitespace-nowrap">RANK</Table.Th>
                  <Table.Th class="whitespace-nowrap">REQUIRED</Table.Th>
                  <Table.Th class="whitespace-nowrap">NEW ROW</Table.Th>
                  <Table.Th class="whitespace-nowrap"></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-if="customFormSection.fields.length == 0" class="intro-x">
                  <Table.Td colspan="6" class="py-0 px-0">
                    <AlertGray />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr class="cursor-pointer" v-for="field in customFormSection.fields" @click="setModalField(true, field.id)" :key="field.id">
                  <Table.Td>
                    {{ field.display.replace( /(<([^>]+)>)/ig, '') }}
                  </Table.Td>
                  <Table.Td>
                    {{ field.name }}
                  </Table.Td>
                  <Table.Td>
                    <FormInput type="number"
                      @blur="modifyFormSectionField('rank', ($event.target as HTMLInputElement).value, field.pivot)"
                      @change="is_change = true" @click="(e)=>e.stopPropagation()" v-model="field.pivot.rank" />
                  </Table.Td>
                  <Table.Td>
                    <FormSwitch>
                      <FormSwitch.Input type="checkbox"  v-model="field.pivot.required"  @click="(e)=>e.stopPropagation()"
                        @change="is_change = true; modifyFormSectionField('required', ($event.target as HTMLInputElement).value, field.pivot)" />
                    </FormSwitch>
                  </Table.Td>
                  <Table.Td>
                    <FormSwitch>
                      <FormSwitch.Input type="checkbox" v-model="field.pivot.new_row"  @click="(e)=>e.stopPropagation()"
                        @change="is_change = true; modifyFormSectionField('new_row', ($event.target as HTMLInputElement).value, field.pivot)" />
                    </FormSwitch>
                  </Table.Td>
                  <Table.Td>
                    <NuxtLink class="flex text-danger text-center cursor-pointer" @click="(event) => {
                      event.preventDefault();
                      setArchivedId(field.pivot.id);
                      setDeleteConfirmationModalForm(true);
                      event.stopPropagation()
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

        </div>
      </div>
    </div>
  </div>
  <EditCustomField :key="customField" v-model="customField" :modelShow="modalShowField" :setModal="setModalFieldOnly"
    :refresh="refreshData" />

  <EditSectionTranslation
    :key="section.id"
    v-if="section.id > 0"
    :setModal="setModalSection"
    :modalShow="modalShowSection"
    v-model="section"
  />
  <SearchFormField v-if="sectionId != 0" :add="addFromCustomField" :section_id="sectionId" :setModel="setModal"
    :modalShow="modalShow" />

  <Confirmation v-model="deleteConfirmationModal" buttonStringMain="Remove"
    subHeader="Do you want to remove this Section from this Custom Form?" :setConfirmationModal="setConfirmationModal"
    :set-id="setDeleteId" :functionToRun="removeCustomForm" />

  <Confirmation v-model="deleteConfirmationModalForm" buttonStringMain="Remove"
    subHeader="Do you want to remove this Section Custom Field?" :setConfirmationModal="setDeleteConfirmationModalForm"
    :set-id="setArchivedId" :functionToRun="removeCustomFormField" />
</template>
