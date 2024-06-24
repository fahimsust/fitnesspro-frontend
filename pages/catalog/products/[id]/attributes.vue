<script lang="ts" setup>
import { Disclosure } from "~/components/enigma/base-components/Headless";
import { ref, watch } from "vue";
import TomSelect from "~/components/enigma/base-components/TomSelect";
import { FormLabel, FormInline } from "~/components/enigma/base-components/Form";

definePageMeta({
  middleware: ["auth"],
  layout: "edit-product",
});

useHead({
  title: "Manage Product Attributes: " + useRuntimeConfig().public.company,
});

const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { getProduct, types } = useProducts();
const {
  addProductAttributeOption,
  getProductAttributes,
  updateProductType,
  errors,
} = useProductAttribute();

let product:any = ref({});
let typeList:any = ref([])
let typeId = ref("");
let productAttribute:any = ref([])
const keyDisclosure = ref("key_" + typeId.value);

watch(typeId, async () => {
  if(submitForm.value)
  {
    let form = reactive({
      type_id: typeId.value,
    });
    await updateProductType(form, idParem);
    validationFocus(form, errors);
    await getProductAttributes(idParem);
    keyDisclosure.value = "key_" + typeId.value;
  }
});
const setValue = async (obj: any) => {
  if (obj.selected == "") {
    obj.selected = [];
  }
  obj.selected = Array.isArray(obj.selected) ? obj.selected : [obj.selected];
  let form = reactive({
    option_ids: obj.selected,
    product_id: idParem,
    attribute_id: obj.id,
  });
  await addProductAttributeOption(form);
  validationFocus(form, errors);
};
const dataLoaded = ref(false)
const submitForm = ref(true)
onMounted(async()=>{
  product = await getProduct(idParem);
  submitForm.value = false
  if (product.value.details.type_id) {
    typeId.value = product.value.details.type_id.toString();
  }
  typeList = await types();
  productAttribute = await getProductAttributes(idParem)
  keyDisclosure.value = "key_" + typeId.value;
  dataLoaded.value = true
  submitForm.value = true
})
</script>
<template>
  <div class="col-span-12 lg:col-span-9">
    <div v-if="!dataLoaded">
      <div class="rounded-lg box intro-y mt-3">
        <TableLoading />
      </div>
    </div> 
    <!-- BEGIN: Post Content -->
    <div class="col-span-12 intro-y" v-if="dataLoaded">
      <div class="p-3 md:p-5 intro-y box xl:mt-5">
        <div>
          <FormInline class="mt-5 first:mt-0 flex-wrap">
            <FormLabel
              class="inline-block sm:text-left sm:mr-3 xl:w-30 xl:!mr-8"
              htmlFor="type"
              ><b>Product Type</b></FormLabel
            >
            <TomSelect v-model="typeId" class="flex items-center flex-1 xl:pr-20 w-full">
              <option value="" key="0">Select Type</option>
              <option :value="option.id" v-for="option in typeList" :key="option.id">
                {{ option.name }}
              </option>
            </TomSelect>
          </FormInline>
        </div>
        <div class="flex items-center mt-5 intro-y">
          <h2 class="mr-auto text-md font-bold">Attributes</h2>
        </div>
        <div
          v-if="Object.keys(productAttribute).length > 0"
          class="mt-5"
          :key="keyDisclosure"
        >
          <Disclosure.Group
            variant="boxed"
            v-if="productAttribute.attribute_sets.length > 0"
          >
            <Disclosure
              v-for="productTypeAttribute in productAttribute.attribute_sets"
              :key="productTypeAttribute.id"
            >
              <Disclosure.Button>
                <b>{{ productTypeAttribute.name }}</b>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div
                  class="grid grid-cols-2 gap-4"
                  v-if="productTypeAttribute.attributes.length > 0"
                >
                  <template v-for="attribute in productTypeAttribute.attributes">
                    <div>
                      <FormLabel htmlFor="type">
                        {{ attribute.name }}
                      </FormLabel>
                      <TomSelect
                        v-model="attribute.selected"
                        class="w-full"
                        placeholder="Select Option"
                        :callBack="
                          () => {
                            setValue(attribute);
                          }
                        "
                        :multiple="attribute.type_id == 1 ? false : true"
                      >
                        <option value="" v-if="attribute.type_id == 1" key="0">
                          Select Option
                        </option>
                        <option
                          :value="option.id"
                          v-for="option in attribute.options"
                          :key="option.id"
                        >
                          {{ option.display }}
                        </option>
                      </TomSelect>
                    </div>
                  </template>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
        <div
          v-if="
            Object.keys(productAttribute).length == 0 ||
            productAttribute.attribute_sets.length == 0
          "
          class="mt-5"
        >
          <AlertGray />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
[hidden] {
  display: none !important;
}
</style>
