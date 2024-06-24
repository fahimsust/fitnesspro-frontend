<script lang="ts" setup>
import { ref, toRefs, reactive, type PropType } from "vue"
import {
  Dialog,
  Tab,
  Disclosure
} from "~/components/enigma/base-components/Headless"
import Tabs from "~/components/tabs/Tabs.vue";
import Button from "~/components/enigma/base-components/Button";
import Basic from "~/components/product/Basic.vue";
import CustomInfo from "~/components/product/CustomInfo.vue";
import Content from "~/components/product/Content.vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Tippy from "~/components/enigma/base-components/Tippy";
import ProductImage from "./ProductImage.vue";
import ProductPrice from "~/components/product/price/ProductPrice.vue";
import ChildInventory from "~/components/product/inventory/ChildInventory.vue";
import { FormSelect } from "~/components/enigma/base-components/Form";

const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  product_id: {
    required: true,
    type: Number,
  },
  modalShow: {
    required: true,
    type: Boolean,
  }
})
const {
  setModel,
  modalShow,
  product_id,
} = toRefs(props)
const { getProduct, getTranslatedProduct } = useProducts();
const { list, getLanguage } = useLanguages();
let product: any = ref([]);
let languages: any = ref([]);
const languageId = ref(1);
const keyComponant = ref(1);
let transLatedData = ref({});
let language: any = ref({});
const dataLoaded = ref(false)
const fetchData = async () => {
  product = await getProduct(product_id.value);
  languages = await list();
  language = await getLanguage(languageId.value);
  dataLoaded.value = true
}
const getTranslated = async () => {
  transLatedData.value = await getTranslatedProduct(product_id.value, languageId.value);
};
const setLanguage = async (event: any) => {
  language = await getLanguage(parseInt(event.target.value));
  transLatedData.value = {};
  if (parseInt(event.target.value) > 1)
    transLatedData.value = await getTranslatedProduct(product_id.value, event.target.value);
  languageId.value = parseInt(event.target.value);
  keyComponant.value = parseInt(event.target.value);
};

const tabList = [
  { title: "Info", description: "Edit Basic Information", icon: "Info" },
  { title: "Image", description: "Update Product Images", icon: "Image" },
  { title: "Pricing", description: "Update Product Pricing", icon: "DollarSign" },
  {
    title: "Inventory",
    description: "Update Product Add Inventory",
    icon: "Cart",
  },
];
onMounted(async () => {
  await nextTick();
  await fetchData();
})
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => {
    setModel(false);
  }
    ">
    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Product Variant ({{ dataLoaded ? product.title : '' }})
        </h2>
      </Dialog.Title>
      <Dialog.Description class="p-3 max-h-[75vh] overflow-auto">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div v-if="dataLoaded">
          <div class="w-full mb-2">
            <div class="w-56 text-slate-500 ml-auto">
              <FormSelect v-model="languageId" @change="setLanguage($event)">
                <option :value="option.id" v-for="option in languages" :key="option.id">
                  {{ option.name }}
                </option>
              </FormSelect>
            </div>
          </div>
          <Tab.Group class="intro-y box" v-if="languageId == 1">
            <Tabs :tablist="tabList" />
            <Tab.Panels>
              <Tab.Panel class="py-3">
                <Disclosure.Group variant="boxed">
                  <Disclosure>
                    <Disclosure.Button>
                      <Tippy content="Edit Basic Information" class="flex items-center font-bold text-md"
                        aria-controls="content" aria-selected="true">
                        <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                        Basic
                      </Tippy>
                    </Disclosure.Button>
                    <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                      <Basic v-model="product" />
                    </Disclosure.Panel>
                  </Disclosure>
                  <Disclosure>
                    <Disclosure.Button>
                      <Tippy content="Update Product Meta" class="flex items-center font-bold text-md"
                        aria-controls="content" aria-selected="true">
                        <Lucide icon="Mail" class="w-4 h-4 mr-2" />
                        Description
                      </Tippy>
                    </Disclosure.Button>
                    <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                      <Content v-model="product" />
                    </Disclosure.Panel>
                  </Disclosure>
                  <Disclosure>
                    <Disclosure.Button>
                      <Tippy content="Update Product Customs Info" class="flex items-center font-bold text-md"
                        aria-controls="content" aria-selected="true">
                        <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                        Customs Info
                      </Tippy>
                    </Disclosure.Button>
                    <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                      <CustomInfo v-model="product" />
                    </Disclosure.Panel>
                  </Disclosure>
                </Disclosure.Group>
              </Tab.Panel>

              <Tab.Panel class="p-3 mt-3 box-border border-gray-300 border">
                <ProductImage v-model="product" :popup="true" />
              </Tab.Panel>
              <Tab.Panel class="p-3 mt-3 box-border border-gray-300 border">
                <ProductPrice v-model="product" :popup="true" />
              </Tab.Panel>
              <Tab.Panel class="p-3 mt-3 box-border border-gray-300 border">
                <ChildInventory v-model="product" />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <Disclosure.Group variant="boxed" v-else>
            <Disclosure>
              <Disclosure.Button>
                <Tippy content="Edit Basic Information" class="flex items-center font-bold text-md"
                  aria-controls="content" aria-selected="true">
                  <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                  Basic
                </Tippy>
              </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <Basic v-model="product" :transLatedData="transLatedData" :languageId="languageId" :key="keyComponant"
                  :getTranslated="getTranslated" :language="language" />
              </Disclosure.Panel>
            </Disclosure>
            <Disclosure>
              <Disclosure.Button>
                <Tippy content="Update Product Meta" class="flex items-center font-bold text-md" aria-controls="content"
                  aria-selected="true">
                  <Lucide icon="Mail" class="w-4 h-4 mr-2" />
                  Description
                </Tippy>
              </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <Content v-model="product" :transLatedData="transLatedData" :languageId="languageId" :key="keyComponant"
                  :getTranslated="getTranslated" :language="language" />
              </Disclosure.Panel>
            </Disclosure>
            <Disclosure>
              <Disclosure.Button>
                <Tippy content="Update Product Customs Info" class="flex items-center font-bold text-md"
                  aria-controls="content" aria-selected="true">
                  <Lucide icon="Menu" class="w-4 h-4 mr-2" />
                  Customs Info
                </Tippy>
              </Disclosure.Button>
              <Disclosure.Panel class="leading-relaxed text-slate-600 dark:text-slate-500">
                <CustomInfo v-model="product" :transLatedData="transLatedData" :languageId="languageId"
                  :key="keyComponant" :getTranslated="getTranslated" :language="language" />
              </Disclosure.Panel>
            </Disclosure>
          </Disclosure.Group>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
