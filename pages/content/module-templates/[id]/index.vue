<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/moduleTemplates/Basic.vue";
import TemplateSection from "~/components/moduleTemplates/TemplateSection.vue";
import { FormSelect, FormLabel } from "~/components/enigma/base-components/Form";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParam = parseInt(route.params.id.toString());

useHead({
  title: "Edit Module Template: " + useRuntimeConfig().public.company,
});

const {
  getModuleTemplate
} = useModuleTemplates();
const template: any = await getModuleTemplate(idParam);

const tabList = [
  { title: "Basic", description: "Edit Basic Information", icon: "Info" },
  { title: "Module Section", description: "Update Meta Content", icon: "Menu" },
];
</script>
<template>
  <div class="mt-8">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ template.name }}
      </h2>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic :refresh-template="getModuleTemplate" :template="template" />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <TemplateSection v-model="template" />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
