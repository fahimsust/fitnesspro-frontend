<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import { SubmitButton, InputField } from "~/components/form";
import { FormLabel, FormInput } from "~/components/enigma/base-components/Form";
const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  add: {
    required: true,
    type: Function,
  },
  product_id: {
    required: true,
    type: Number,
  },
  package_id: {
    required: true,
    type: Number,
  }
});
const selectedAccessoriesCheckbox: any = ref([]);
const selectedAccessoriesSelect: any = reactive({});
const selectedAccessoryOptionCheckbox: any = ref([]);
const selectedAccessoryOptionSelect: any = reactive({});
const accessoryQuantity: any = reactive({});
const selectedOptionsCheckbox: any = ref([]);
const selectedOptionsSelect: any = reactive({});
const selectedFormOptionSelect: any = reactive({});
const selectedFormOptionCheckbox: any = ref([])
const selectedMultiple: any = ref([])


const { createOrderItem, errors, loadingOrderItem } = useOrderItems()
const { setModel, modalShow, add, product_id, package_id } = toRefs(props);
const { getProductDetails } = useOrderItems();
const form: any = reactive({
  package_id: package_id.value,
  child_product_id: product_id.value,
  qty: 1,
  option_custom_values: [],
  accessories: [],
  custom_field_values: []
});

const addItemToPackage = async () => {
  form.option_custom_values = [];

  if (product.value.options && product.value.options.length > 0) {
    product.value.options.forEach((optionObj: any) => {
      const optionId = optionObj.id;

      if (selectedOptionsSelect[optionId]) {
        const optionSelect = selectedOptionsSelect[optionId];

        if (optionSelect) {
          form.option_custom_values.push({
            option_value_id: optionSelect,
            custom_value: '',
          });
        }
      }

      for (const key in selectedOptionsCheckbox.value) {
        if (selectedOptionsCheckbox.value[key]) {
          const valueSplit = selectedOptionsCheckbox.value[key].split("-");
          const value = parseInt(valueSplit[0]);

          if (parseInt(valueSplit[1]) === optionId) {
            form.option_custom_values.push({
              option_value_id: value,
              custom_value: '',
            });
          }
        }
      }
    });
  }

  form.accessories = [];

  if (product.value.accessories && product.value.accessories.length > 0) {
    product.value.accessories.forEach((accessory: any) => {
      let options: any = [];

      if (selectedAccessoriesCheckbox.value.includes(accessory.id)) {
        if (accessory.options && accessory.options.length > 0) {
          accessory.options.forEach((optionObj: any) => {
            const optionId = optionObj.id;

            if (selectedAccessoryOptionSelect[`${accessory.id}-${optionId}`]) {
              const optionSelect = selectedAccessoryOptionSelect[`${accessory.id}-${optionId}`];

              if (optionSelect) {
                options.push({
                  option_value_id: optionSelect,
                  custom_value: '',
                });
              }
            }

            for (const key in selectedAccessoryOptionCheckbox.value) {
              if (selectedAccessoryOptionCheckbox.value[key]) {
                const valueSplit1 = selectedAccessoryOptionCheckbox.value[key].split("|");

                if (parseInt(valueSplit1[1]) === accessory.id) {
                  const valueSplit = valueSplit1[0].split("-");
                  const value = parseInt(valueSplit[0]);

                  if (parseInt(valueSplit[1]) === optionId) {
                    options.push({
                      option_value_id: value,
                      custom_value: '',
                    });
                  }
                }
              }
            }
          });
        }

        form.accessories.push({
          accessory_id: accessory.id,
          qty: accessoryQuantity[accessory.id] && accessoryQuantity[accessory.id] > 0 ? accessoryQuantity[accessory.id] : 1,
          options: options,
        });
      }
    });
  }

  form.custom_field_values = [];
  if (product.value.custom_forms && product.value.custom_forms.length > 0) {
    product.value.custom_forms.forEach((custom_form: any) => {
      if (custom_form.sections) {
        custom_form.sections.forEach((section: any) => {
          if (section.fields) {
            section.fields.forEach((field: any) => {
              if (field) {
                const formId = custom_form.id;
                const sectionId = section.id;
                const fieldId = field.id;

                const key = fieldId + '-' + sectionId + '-' + formId;

                if (selectedFormOptionSelect[key]) {
                  const data = selectedFormOptionSelect[key];

                  if (data) {
                    form.custom_field_values.push({
                      form_id: formId,
                      section_id: sectionId,
                      field_id: fieldId,
                      value: data
                    });
                  }
                }
                const multipleValue = selectedFormOptionCheckbox.value;
                const multipleValue2 = selectedMultiple.value;
                const valueArray: any = [];
                if (multipleValue && Array.isArray(multipleValue)) {
                  multipleValue.forEach((value) => {
                    const valueSplit = value.split("-");
                    if (valueSplit.length == 4 && parseInt(valueSplit[1]) == fieldId && parseInt(valueSplit[2]) == sectionId && parseInt(valueSplit[3]) == formId) {
                      valueArray.push(valueSplit[0])
                    }
                  });
                }
                if (multipleValue2 && Array.isArray(multipleValue2)) {
                  multipleValue2.forEach((value) => {
                    const valueSplit = value.split("-");
                    if (valueSplit.length == 4 && parseInt(valueSplit[1]) == fieldId && parseInt(valueSplit[2]) == sectionId && parseInt(valueSplit[3]) == formId) {
                      valueArray.push(valueSplit[0])
                    }
                  });
                }
                if (valueArray.length > 0) {
                  if (valueArray.length == 1)
                    form.custom_field_values.push({
                      form_id: formId,
                      section_id: sectionId,
                      field_id: fieldId,
                      value: valueArray[0]
                    });
                  else
                    form.custom_field_values.push({
                      form_id: formId,
                      section_id: sectionId,
                      field_id: fieldId,
                      value: JSON.stringify(valueArray)
                    });
                }
              }
            });
          }
        })
      }
    });
  }
  if (form.qty < 1) {
    form.qty = 1
  }
  await createOrderItem(form, package_id.value);

  if (Object.keys(errors).length == 0) {
    await add.value();
    setModel.value(false)
  }
};
let product: any = ref({})
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  product = await getProductDetails(product_id.value);
  dataLoaded.value = true
});
</script>
<template>
  <Dialog size="xl" :open="modalShow" @close="() => { setModel(false); }">

    <Dialog.Panel class="p-3">
      <a @click="(event) => {
        event.preventDefault();
        setModel(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Product To Package #{{ package_id }}</h2>
      </Dialog.Title>
      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <!-- Left side - Product Details and Image -->
        <div class="flex" v-if="dataLoaded">
          <div class="flex-1 p-4 border rounded shadow bg-white">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ product.title }}</h2>
            <img v-if="product.image" :alt="product.image.name" class="w-full mb-4 border"
              :src="`${useRuntimeConfig().public.s3ImageUrl}/tr:w-auto/${product.image.filename}`" />
            <p class="text-gray-700">{{ product.details.description }}</p>
            <div class="mt-2">
              <InputField v-model="form" name="qty" min="1" title="Quantity" type="number" />
            </div>
          </div>

          <!-- Right side - Options and Accessories -->
          <div class="flex-1 p-4 border rounded shadow bg-white ml-4">
            <!-- Display Options -->
            <div v-if="product.options && product.options.length > 0">
              <h3 class="font-semibold text-lg mb-2 text-gray-800">Options</h3>
              <div v-for="option in product.options" :key="option.id" class="mb-4">
                <div v-if="option.option_type.id === 2" class="mb-1">
                  <label class="block font-semibold text-gray-700">{{ option.display }}</label>
                  <div v-for="value in option.option_values" :key="value.id" class="ml-4">
                    <label class="flex items-center text-gray-700 mt-1">
                      <input type="checkbox" :value="value.id + '-' + option.id" v-model="selectedOptionsCheckbox"
                        class="mr-2 text-blue-500">
                      <span class="text-black">{{ value.name }}</span>
                    </label>
                  </div>
                </div>
                <div v-else>
                  <label class="block font-semibold text-gray-700">{{ option.display }}</label>
                  <select v-model="selectedOptionsSelect[option.id]"
                    class="w-full p-2 mt-1 border rounded bg-gray-100 text-gray-800">
                    <option v-for="value in option.option_values" :key="value.id" :value="value.id">
                      {{ value.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Display Accessories -->
            <div v-if="product.accessories && product.accessories.length > 0">
              <h3 class="font-semibold text-lg mt-4 mb-2 text-gray-800">Accessories</h3>
              <div v-for="accessory in product.accessories" :key="accessory.id" class="mb-4">
                <label class="flex items-center text-gray-700">
                  <input type="checkbox" v-model="selectedAccessoriesCheckbox" :value="accessory.id"
                    class="mr-2 text-blue-500">
                  <span class="text-black">{{ accessory.title }}</span>
                </label>
                <!-- Display accessory options if selected -->
                <div v-if="selectedAccessoriesCheckbox.includes(accessory.id)" class="ml-8">
                  <div v-if="accessory.options && accessory.options.length > 0">
                    <h3 class="font-semibold text-lg mb-2 text-gray-800">Options</h3>
                    <div v-for="option in accessory.options" :key="option.id" class="mb-4">
                      <div v-if="option.option_type.id === 2" class="mb-1">
                        <label class="block font-semibold text-gray-700">{{ option.display }}</label>
                        <div v-for="value in option.option_values" :key="value.id" class="ml-4 mt-1">
                          <label class="flex items-center text-gray-700">
                            <input type="checkbox" v-model="selectedAccessoryOptionCheckbox"
                              :value="value.id + '-' + option.id + '|' + accessory.id" class="mr-2 text-blue-500">
                            <span class="text-black">{{ value.name }}</span>
                          </label>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Display as select box -->
                        <label class="block font-semibold text-gray-700">{{ option.display }}</label>
                        <select v-model="selectedAccessoryOptionSelect[accessory.id + '-' + option.id]"
                          class="w-full p-2 m-1 border rounded bg-gray-100 text-gray-800">
                          <option v-for="value in option.option_values" :key="value.id" :value="value.id">
                            {{ value.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-2">
                  <FormLabel htmlFor="Quantity">Quantity</FormLabel>
                  <FormInput v-model="accessoryQuantity[accessory.id]" type="number" min="1" />
                </div>
              </div>

            </div>

            <div v-if="product.custom_forms && product.custom_forms.length > 0">
              <div v-for="customForm in product.custom_forms" :key="customForm.id" class="mb-4">
                <h4 v-if="customForm.sections && customForm.sections.length > 0"
                  class="font-semibold text-lg mb-2 text-blue-600">{{ customForm.name }}</h4>
                <div v-for="section in customForm.sections" :key="section.id">
                  <div v-for="field in section.fields" :key="field.id" class="mb-4">
                    <label class="block font-semibold text-gray-700">{{ field.name }}</label>
                    <div v-if="field.type === 0 || field.type === 1">
                      <input v-if="field.type === 0" type="text"
                        v-model="selectedFormOptionSelect[field.id + '-' + section.id + '-' + customForm.id]"
                        class="w-full p-2 m-1 border rounded bg-gray-100 text-gray-800">
                      <textarea v-else
                        v-model="selectedFormOptionSelect[field.id + '-' + section.id + '-' + customForm.id]"
                        class="w-full p-2 m-1 border rounded bg-gray-100 text-gray-800"></textarea>
                    </div>
                    <div v-else-if="field.type === 2">
                      <div v-for="value in field.options" :key="value.id" class="ml-4 mt-1">
                        <label class="flex items-center text-gray-700">
                          <input type="checkbox" v-model="selectedFormOptionCheckbox"
                            :value="value.display + '-' + field.id + '-' + section.id + '-' + customForm.id"
                            class="mr-2 text-gray-800">
                          <span class="text-black">{{ value.display }}</span>
                        </label>
                      </div>
                    </div>
                    <div v-else-if="field.type === 4">
                      <select v-model="selectedFormOptionSelect[field.id + '-' + section.id + '-' + customForm.id]"
                        class="w-full p-2 m-1 border rounded bg-gray-100 text-gray-800">
                        <option v-for="value in field.options" :key="value.id" :value="value.display">
                          {{ value.display }}
                        </option>
                      </select>
                    </div>
                    <div v-else-if="field.type === 3 || field.type === 6">
                      <!-- Radio or Button (similar to radio) -->
                      <div v-for="value in field.options" :key="value.id" class="ml-4 mt-1">
                        <label class="flex items-center text-gray-700">
                          <input type="radio"
                            v-model="selectedFormOptionSelect[field.id + '-' + section.id + '-' + customForm.id]"
                            :value="value.display" class="mr-2 text-gray-800">
                          <span class="text-black">{{ value.display }}</span>
                        </label>
                      </div>
                    </div>

                    <div v-else-if="field.type === 5">
                      <!-- Select Multiple -->
                      <select v-model="selectedMultiple" multiple
                        class="w-full p-2 m-1 border rounded bg-gray-100 text-gray-800">
                        <option v-for="value in field.options" :key="value.id"
                          :value="value.display + '-' + field.id + '-' + section.id + '-' + customForm.id">
                          {{ value.display }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <SubmitButton :createFunction="addItemToPackage" buttonText="Add" :loading="loadingOrderItem" />
          </div>
        </div>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
