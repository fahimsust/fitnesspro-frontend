<script setup lang="ts">
import _ from "lodash";
import { SelectField, SubmitButton } from "~/components/form";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import TomSelectField from "~/components/form/TomSelectField.vue";
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    required: true,
    type: Object
  }
});
const { getLayoutSections, geModule, getModuleTemplate } = useModuleTemplates();
const { deleteModuleSectionTemplate, errors, loading, createModuleTemplateSection, deleteConfirmationModal, setDeleteId } = useModuleTemplateSections();
const { deleteModuleTemplateModule, updateModuleTemplateModule, selectedId, errorModule, loadingModule, createModuleTemplateModule } = useModuleTemplateModules();
let { modelValue: template } = toRefs(props);

let layoutSections: any = ref([]);
let modules: any = ref([]);

let formAdd = {
  template_id: template.value.id,
  section_id: null
}
let formAddModule = {
  template_id: template.value.id,
  section_id: null,
  module_id: null
}
const refresh = async () => {
  const newTemplate = await getModuleTemplate(template.value.id)
  emit("update:modelValue", newTemplate.value);
  template.value = newTemplate.value
}
const validateAndCreate = async () => {
  await createModuleTemplateSection(formAdd);
  await refresh();
};
const validateAndCreateModule = async (section_id: any) => {
  formAddModule.section_id = section_id
  await createModuleTemplateModule(formAddModule);
  await refresh();
};
const validateAndUpdate = async (rank: string, id: number) => {
  let formEdit = {
    rank: rank,
  }
  await updateModuleTemplateModule(formEdit, id);
  await refresh();
};
const deleteSection = async () => {
  await deleteModuleSectionTemplate()
  await refresh();
  setConfirmationModal(false);
}
const deleteModule = async (id: number) => {
  await deleteModuleTemplateModule(id)
  await refresh();
}
const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  layoutSections = await getLayoutSections();
  modules = await geModule();
  dataLoaded.value = true
});
</script>

<template>
  <div v-if="!dataLoaded">
    <div class="rounded-lg box intro-y mt-3">
      <TableLoading />
    </div>
  </div>
  <div class="p-3" v-if="dataLoaded">
    <div class="mt-5 p-6 border-2 border-gray-100 dark:bg-black/40 rounded-lg">
      <!-- Legend for the section -->
      <h2 class="mb-4">Add Section</h2>

      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 intro-y md:col-span-6 !z-50">
          <TomSelectField :withLabel="false" defaultOption="Select Section" :options="layoutSections" name="section_id"
            v-model="formAdd" optionTitle="display" :error="errors.section_id" title="Select Layout Section" />
        </div>
        <div class="col-span-12 intro-y md:col-span-6 mt-0">
          <SubmitButton buttonText="Add" :createFunction="validateAndCreate" :loading="loading" />
        </div>
      </div>
    </div>


    <div class="mt-5 p-6 border-2 border-gray-100  dark:bg-gray-900  rounded-lg"
      v-for="moduleSection in template.module_template_sections">
      <div class="gap-4 grid grid-cols-12 md:gap-4">
        <div class="col-span-12 md:col-span-10">
          <h2 class="text-lg font-semibold mb-4 text-success">{{ moduleSection.layout_section.display }}</h2>
        </div>
        <div class="col-span-12 md:col-span-2 md:text-right">
          <Button variant="danger" type="button" @click="(event) => {
            event.preventDefault();
            setDeleteId(moduleSection.id);
            setConfirmationModal(true);
            event.stopPropagation();
          }" class="w-24 mr-2 mt-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded">
            Delete
          </Button>
        </div>

        <div class="col-span-12">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 intro-y md:col-span-6">
              <TomSelectField :options="modules" :currentId="moduleSection.layout_section.id" :selectedId="selectedId"
                :withLabel="false" defaultOption="Select Module" name="module_id" v-model="formAddModule"
                :error="errorModule.module_id" title="Select Module" />
            </div>
            <div class="col-span-12 intro-y md:col-span-6 mt-0">
              <SubmitButton buttonText="Add Module"
                :createFunction="() => validateAndCreateModule(moduleSection.layout_section.id)"
                :loading="loadingModule" />
            </div>
            <div class="overflow-auto col-span-12 intro-y">
              <Table class="border-spacing-y-[10px] border-separate hover">
                <Table.Thead variant="dark">
                  <Table.Tr>
                    <Table.Th class="whitespace-nowrap">Name</Table.Th>
                    <Table.Th class="whitespace-nowrap">Rank</Table.Th>
                    <Table.Th class="whitespace-nowrap text-center"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr
                    v-if="moduleSection.modules_templates_modules != null && moduleSection.modules_templates_modules.length == 0"
                    class="intro-x">
                    <Table.Td colspan="6" class="py-0 px-0">
                      <AlertGray />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr v-for="module_template_module in moduleSection.modules_templates_modules"
                    :key="module_template_module.id" class="intro-x">
                    <Table.Td>
                      {{ module_template_module.module.name }}
                    </Table.Td>
                    <Table.Td>
                      <input class="input_class" type="number" v-model="module_template_module.rank"
                        @blur="validateAndUpdate(($event.target as HTMLInputElement).value, module_template_module.id)" />
                    </Table.Td>

                    <Table.Td>
                      <div class="flex items-center justify-center">
                        <NuxtLink class="flex text-danger text-center cursor-pointer" @click="() => {
            deleteModule(module_template_module.id);
          }">
                          <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                          <span class="hidden">Remove</span>
                        </NuxtLink>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>

        </div>

      </div>
    </div>
    <Confirmation v-model="deleteConfirmationModal" button-string-main="Delete"
      :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
      sub-header="Do you really want to delete this module section?" :functionToRun="deleteSection" />


  </div>
</template>
