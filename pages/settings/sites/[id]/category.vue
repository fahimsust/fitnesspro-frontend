<script lang="ts" setup>
import _ from "lodash";
import SiteCategory from "~~/components/site/SiteCategory.vue";
import {  SelectField } from "~/components/form";
import { FormInline } from "~/components/enigma/base-components/Form";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-site",
});
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { addFilterCategory,errors,loading } = useSiteCategory();
const { getSiteSetting } = useSiteSetting();

const filterCategoryOptions = [
  {id:"0",name:'Use All Categories'},
  {id:"1",name:'Show Only Assigned Categories'},
  {id:"2",name:'Hide Assigned Categories'},
]
let form:any = reactive({});

useHead({
  title: "Edit Site: " + useRuntimeConfig().public.company,
});
const filterSave = async () => {
  await addFilterCategory(form,idParem);
  validationFocus(form, errors);
};
let siteSetting:any = ref([])
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  siteSetting = await getSiteSetting(idParem)
  form = reactive({
    filter_categories: siteSetting.value.filter_categories,
  });
  dataLoaded.value = true
});
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded">
          <FormInline class="mt-5 first:mt-0 flex-wrap p-3">
            <SelectField
            :options="filterCategoryOptions"
            :runFunction="filterSave"
            name="filter_categories"
            v-model="form"
            :error="errors.affiliate_level_id"
            title="Filter Categories"
            :hasDefault=" false"
            :formInline="true"
          />
          </FormInline>
        </div>
        <SiteCategory />
      </div>
    </div>
  </div>
</template>