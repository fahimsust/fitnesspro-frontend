<script lang="ts" setup>
import { toRefs } from "vue";
import { InputField, SelectField, SubmitButton } from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";

const props = defineProps({
  goToStep: {
    required: true,
    type: Function,
  },
});
const { goToStep } = toRefs(props);
const {
  getRegistrationDiscounts,
  saveDiscountCode,
  deleteDiscount,
  errors,
  loading,
} = useAccount();
const discounts = await getRegistrationDiscounts();
let form = reactive({
  discount_code: null,
});

const validateAndCreate = async () => {
  await saveDiscountCode(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await getRegistrationDiscounts();
  }
};
</script>
<template>
  <div class="px-5 mt-10">
    <div class="text-lg font-medium text-center">Discount</div>
  </div>
  <div class="px-5 pt-10 mt-10 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
    <div class="grid grid-cols-12 gap-2 mt-5 gap-y-2">
      <div class="col-span-12 intro-y sm:col-span-12">
        <InputField name="discount_code" v-model="form" :error="errors.discount_code" title="Discount Code"
          :required="true" />
      </div>
      <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <SubmitButton buttonText="Save" :createFunction="validateAndCreate" :loading="loading" />
      </div>
      <div class="col-span-12 intro-y sm:col-span-12">
        <div class="text-base font-medium">Applied Discount</div>
        <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
          <Table.Thead variant="dark">
            <Table.Tr>
              <Table.Th class="whitespace-nowrap">DISCOUNT</Table.Th>
              <Table.Th class="whitespace-nowrap text-center"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-if="discounts.length == 0" class="intro-x">
              <Table.Td colspan="2" class="py-0 px-0">
                <AlertGray />
              </Table.Td>
            </Table.Tr>
            <Table.Tr v-for="discount in discounts" :key="discount.id" class="intro-x">
              <Table.Td>
                {{ discount.discount.display }}
              </Table.Td>

              <Table.Td>
                <div class="flex items-center justify-center">
                  <NuxtLink class="flex text-danger cursor-pointer" @click="async (event) => {
                    await deleteDiscount(discount.id);
                  }
                    ">
                    <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                    <span class="hidden">Delete</span>
                  </NuxtLink>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <div class="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
          <SubmitButton buttonText="Next" :createFunction="() => { goToStep(6) }" :loading="loading" />
        </div>
      </div>
    </div>
  </div>
</template>
