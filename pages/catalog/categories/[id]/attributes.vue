<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { SelectField } from "~/components/form";
import AttributeRule from "~/components/category/AttributeRule.vue"
definePageMeta({
  middleware: ["auth"],
  layout: "edit-category",
});

useHead({
  title: "Edit Category Pricing: " + useRuntimeConfig().public.company,
});
const route = useRoute();

const { updateCategoryFilter, getCategory, errors, loading } = useCategories();
const idParem = parseInt(route.params.id.toString());
let category:any = ref({});

const options = [
  { id: "any", "name": 'any' },
  { id: "all", "name": 'all' }
]

let form = reactive({});
const validateAndCreate = async () => {
  await updateCategoryFilter(form, idParem);
  validationFocus(form, errors);
  await getCategory(idParem);
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  category = await getCategory(idParem);
  form = reactive({
    rules_match_type: category.value.rules_match_type,
    show_types: category.value.show_types,
    show_brands: category.value.show_brands,
    limit_min_price: category.value.limit_min_price,
    min_price: category.value.min_price,
    limit_max_price: category.value.limit_max_price,
    max_price: category.value.max_price,
    limit_days: category.value.limit_days,
    show_sale: category.value.show_sale,
  });
  dataLoaded.value = true;
});
</script>

<template>
  <div class="col-span-12 lg:col-span-9">
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y">
      <div class="p-5 intro-y box xl:mt-5  border-b border-slate-200/60 dark:border-darkmode-400">
        <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="!dataLoaded">
          <div class="rounded-lg box intro-y lg:mt-14">
            <TableLoading />
          </div>
        </div> 
        <div class="mt-5" v-if="dataLoaded">
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <SelectField name="rules_match_type" v-model="form" :hasDefault="false" :error="errors.rules_match_type"
              title="Match Rules" :run-function="validateAndCreate" :options="options" />
          </FormInline>
        </div>
        <AttributeRule />
      </div>
    </div>
  </div>
</template>
