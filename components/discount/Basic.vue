<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { InputField, SubmitButton } from "~/components/form";
import DatePickerField from "~/components/form/DatePickerField.vue";
const emit = defineEmits(["update:modelValue"]);

const { updateDiscount, errors, loading } = useDiscount();
const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  }
});

const { modelValue: discount } = toRefs(props);

let form = reactive({
  name: discount.value.name,
  display: discount.value.display,
  start_date: discount.value.start_date,
  exp_date: discount.value.exp_date,
  limit_uses: discount.value.limit_uses,
  limit_per_order: discount.value.limit_per_order,
  limit_per_customer: discount.value.limit_per_customer,
});
const validateAndCreate = async () => {
  const updatedDiscount = await updateDiscount(form, discount.value.id);
  validationFocus(form, errors);
  if (updatedDiscount != null) emit("update:modelValue", updatedDiscount);
};
</script>

<template>
  <div class="p-1">
    <div class="grid grid-cols-12 gap-2">


      <div class="col-span-12 intro-y md:col-span-6">
        <InputField name="name" type="text" v-model="form" :error="errors.name" title="Name" />
      </div>
      <div class="col-span-12 intro-y md:col-span-6">
        <InputField name="display" type="text" v-model="form" :error="errors.display" title="Display" />
      </div>

      <div class="col-span-12 mt-3 intro-y md:col-span-6">
        <DatePickerField name="start_date" v-model="form" :required="true" :error="errors.start_date"
          title="Start Date" />
      </div>
      <div class="col-span-12  mt-3  intro-y md:col-span-6">
        <DatePickerField name="exp_date" v-model="form" :required="true" :error="errors.exp_date"
          title="Expiration Date" />
      </div>
      <div class="col-span-12 mt-3 intro-y md:col-span-6">
        <InputField name="limit_uses" type="number" v-model="form" :error="errors.limit_uses"
          title="Number of Times Discount Can Be Used Total" />
      </div>
      <div class="col-span-12 mt-3 intro-y md:col-span-6">
        <InputField name="limit_per_order" type="number" v-model="form" :error="errors.limit_per_order"
          title="Number of Times Discount Can Apply (Per Order)" />
      </div>
      <div class="col-span-12 mt-3 intro-y md:col-span-6">
        <InputField name="limit_per_customer" type="number" v-model="form" :error="errors.limit_per_customer"
          title="Number of Times Discount Can Apply (Per Customer, Requires Account)" />
      </div>
    </div>
    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
