<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import ModuleSection from "~/components/moduleTemplate/ModuleSection.vue"
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});

useHead({
  title: "Category Setting Template: " + useRuntimeConfig().public.company,
});
const router = useRouter();
const queryParam = useQueryParamStore().queryParam
if(queryParam && queryParam.setting_template)
{ 
  await router.push({ path: `/catalog/categories/settings-template`, query: queryParam.setting_template });
}
useQueryParamStore().setQueryParam({})
const route = useRoute();
const editLink = (id: Number) => {
  const currentQuery = {setting_template:{ ...route.query }};
  if(route.query)
  {
    useQueryParamStore().setQueryParam(currentQuery)
  }
  router.push("/catalog/categories/settings-template/" + id);
};

const {
  list,
  deleteSettingTemplate,
  deleteConfirmationModal,
  setArchiveId,
} = useCategorySettingTemplate();
const { getCategoryTemplateSettingsModulesSection } = useSettingModuleTemplate();

let categorySettingTemplates:any = ref([])
const createLink = () => {
  router.push("/catalog/categories/settings-template/create");
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const module_template_id = ref(0)
const settings_template_id = ref(0)
const modalShow = ref(false);
const setModal = (value: boolean) => {
  modalShow.value = value;
};
const setValueAndOpenModal = (categorySettingTemplate: any) => {
  if( categorySettingTemplate.module_template_id != null  )
    module_template_id.value = categorySettingTemplate.module_template_id
  
  settings_template_id.value = categorySettingTemplate.id
  setModal(true);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  categorySettingTemplates = await list();
  dataLoaded.value = true
});
</script>

<template>
  <h2 class="mt-10 text-lg font-medium intro-y">Setting Templates</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button @click="createLink" variant="primary" class="mr-2 shadow-md">
        Add Setting Template
      </Button>

      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
         
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">ID</Table.Th>
            <Table.Th class="whitespace-nowrap">NAME</Table.Th>
            <Table.Th class="whitespace-nowrap text-center"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="categorySettingTemplates.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="3" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr
            v-for="categorySettingTemplate in categorySettingTemplates"
            @click="editLink(categorySettingTemplate.id)"
            :class="'cursor-pointer'"
            :key="categorySettingTemplate.id"
            class="intro-x"
          >
            <Table.Td>
              {{ categorySettingTemplate.id }}
            </Table.Td>
            <Table.Td>
              {{ categorySettingTemplate.name }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink
                  class="flex text-danger cursor-pointer"
                  @click="
                    (event) => {
                      event.preventDefault();
                      setArchiveId(categorySettingTemplate.id);
                      setConfirmationModal(true);
                      event.stopPropagation();
                    }
                  "
                >
                  <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                  <span class="hidden">Delete</span>
                </NuxtLink>
                <NuxtLink  @click="
                    (event) => {
                      event.preventDefault();
                      setValueAndOpenModal(categorySettingTemplate)
                      event.stopPropagation();
                    }
                  " class="flex text-success cursor-pointer">
                  <Lucide icon="Settings" class="w-4 h-4 mr-1" />
                  <span class="hidden">Module Settings</span>
                </NuxtLink>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  </div>
  <Confirmation
    v-model="deleteConfirmationModal"
    :setConfirmationModal="setConfirmationModal"
    :set-id="setArchiveId"
    :functionToRun="deleteSettingTemplate"
  />
  <ModuleSection :key="module_template_id" :getModulesSection="getCategoryTemplateSettingsModulesSection"
    :modalShow="modalShow" :setModel="setModal"  :module_template_id="module_template_id"
    :settings_template="settings_template_id" />
</template>
