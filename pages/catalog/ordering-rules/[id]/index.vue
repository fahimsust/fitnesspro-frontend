<script lang="ts" setup>
import _ from "lodash";
import { Tab } from "~/components/enigma/base-components/Headless";
import Tabs from "~/components/tabs/Tabs.vue";
import Basic from "~/components/orderingRule/Basic.vue";
import ChildRules from "~/components/orderingRule/ChildRules.vue";
import { FormSelect } from "~/components/enigma/base-components/Form";
import OrderingConditions from "~/components/orderingRule/OrderingConditions.vue";

const route = useRoute();

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
const idParem = parseInt(route.params.id.toString());

useHead({
  title: "Edit Ordering Rule: " + useRuntimeConfig().public.company,
});
const { getRule, getTranslatedOrderingRule } = useOrderingRule();
const { list, getLanguage } = useLanguages();

const dataLoaded = ref(false)
let rule:any = ref({})
let languages:any = ref([])
let language:any = ref({})

const fetchData = async()=>{
  rule = await getRule(idParem);
  languages = await list();
  language = await getLanguage(languageId.value);
  dataLoaded.value = true
}


const languageId = ref(1);
const transLatedData = ref({});
const setLanguage = async (event: any) => {
  language = await getLanguage(parseInt(event.target.value));
  transLatedData.value = {};
  if (languageId.value > 1)
    transLatedData.value = await getTranslatedOrderingRule(idParem, event.target.value);
  languageId.value = event.target.value;
};

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Child Rules", description: "Child Rules Management", icon: "Filter" },
  {
    title: "Conditions",
    description: "Ordering Rule Condition Management",
    icon: "CheckSquare",
  },
];
onMounted(async () => {
  await nextTick();
  await fetchData();
});
</script>
<template>
  <div class="mt-3" v-if="!dataLoaded">
    <div class="rounded-lg box intro-y lg:mt-0">
      <TableLoading />
    </div>
  </div> 
  <div class="mt-8" v-if="dataLoaded">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="mt-2 mr-auto text-lg mb-3 font-medium intro-y">
        {{ rule.name }}
      </h2>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 mb-3">
        <div class="relative w-56 text-slate-500">
          <FormSelect v-model="languageId" @change="setLanguage($event)">
            <option :value="option.id" v-for="option in languages" :key="option.id">
              {{ option.name }}
            </option>
          </FormSelect>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-12">
      <!-- BEGIN: Post Content -->
      <div class="col-span-12 intro-y box xl:mt-5">
        <Tab.Group class="intro-y box">
          <Tabs :tablist="tabList" />
          <Tab.Panels>
            <Tab.Panel class="p-0 md:p-5">
              <Basic
                v-model="rule"
                :key="languageId"
                :languageId="languageId"
                :language="language"
                :translatedData="transLatedData"
              />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <ChildRules />
            </Tab.Panel>
            <Tab.Panel class="p-0 md:p-5">
              <OrderingConditions />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  </div>
</template>
