<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { FormInline } from "~/components/enigma/base-components/Form";
import { SubmitButton, CheckBoxField, SelectField, InputField } from "~/components/form";

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
let category: any = ref({});

const saleStatus: any = [
  { id: 1, name: "Only show items on sale" },
  { id: 2, name: "Only show items not on sale" },
];

let form = reactive({
  rules_match_type: category.value.rules_match_type,
  show_types: category.value.show_types,
  show_brands: category.value.show_brands,
  limit_min_price: category.value.limit_min_price,
  min_price: category.value.min_price,
  limit_max_price: category.value.limit_max_price,
  max_price: category.value.max_price,
  limit_days: category.value.limit_days,
  show_sale: category.value.show_sale ? category.value.show_sale : null,
});
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
      <div class="col-span-12 lg:col-span-9 2xl:col-span-10" v-if="!dataLoaded">
        <div class="rounded-lg box intro-y mt-3">
          <TableLoading />
        </div>
      </div>
      <div class="p-5 intro-y box xl:mt-5" v-if="dataLoaded">
        <div class="p-5 mt-0 border rounded-md border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center pb-5 font-medium border-b border-slate-200/60 dark:border-darkmode-400">
            Pricing Setting
          </div>
          <div class="mt-5">
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <check-box-field name="limit_min_price" v-model="form" :error="errors.limit_min_price"
                title="Filter by Minimum Price" :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="form.limit_min_price">
              <InputField name="min_price" v-model="form" :error="errors.min_price" title="Min Price"
                :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <check-box-field name="limit_max_price" v-model="form" :error="errors.limit_max_price"
                title="Filter by Maximum Price" :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap" v-if="form.limit_max_price">
              <InputField name="max_price" v-model="form" :error="errors.max_price" title="Max Price"
                :formInline="true" />
            </FormInline>
            <FormInline class="mt-5 first:mt-0 flex-wrap">
              <SelectField :options="saleStatus" name="show_sale" v-model="form" :error="errors.show_sale"
                title="Filter by Sale Status" default-option="Show Items on sale and not on sale" :formInline="true" />
            </FormInline>
            <div class="mt-5 text-right">
              <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
