<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { toRefs } from "vue";
import { InputField, SubmitButton, TextAreaField, CheckBoxField, SelectField } from "~/components/form";
const route = useRoute();

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: customer } = toRefs(props);
const customerId = customer.value.id;
const { updateAccount, loading, errors, getCustomer, accountStatuses } = useCustomers();

let form = reactive({
  username: customer.value.username,
  email: customer.value.email,
  first_name: customer.value.first_name,
  last_name: customer.value.last_name,
  phone: customer.value.phone,
  status_id: customer.value.status_id,
  affiliate_id: customer.value.affiliate_id,
  photo_id: customer.value.photo_id,
  profile_public: customer.value.profile_public,
  admin_notes: customer.value.admin_notes,
  password: ''
});
const emit = defineEmits(["update:modelValue"]);
const validateAndCreate = async () => {
  await updateAccount(form, customerId);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    const account = getCustomer(customerId)
    emit("update:modelValue", account);
  }
};
let statuses:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  statuses = await accountStatuses();
  dataLoaded.value = true
});
</script>

<template>
  <div class="p-1">
    <div class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-6 xs:col-span-12">
        <InputField name="email" type="text" v-model="form" :error="errors.email" title="Email Address" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <div v-if="!dataLoaded" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
        <SelectField v-if="dataLoaded && statuses" :options="statuses" name="status_id" v-model="form" :hasDefault="false"
          :error="errors.status_id" title="Default Status" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="phone" type="text" v-model="form" :error="errors.phone" title="Phones" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="username" type="text" v-model="form" :error="errors.username" title="Username" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="first_name" type="text" v-model="form" :error="errors.first_name" title="First Name" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="last_name" type="text" v-model="form" :error="errors.last_name" title="Last Name" />
      </div>

      <div class="mt-3 col-span-6 xs:col-span-12">
        <CheckBoxField name="profile_public" v-model="form" :error="errors.profile_public" title="Make Profile Public" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="photo_id" type="number" v-model="form" :error="errors.photo_id" title="Profile Photo" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="password" type="password" autoComplete="new-password" v-model="form"
          placeholder="Input password if you want to reset" :error="errors.password" title="Reset Password" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <InputField name="affiliate_id" type="number" v-model="form" :error="errors.affiliate_id"
          title="Affiliate Referrer" />
      </div>
      <div class="col-span-6 xs:col-span-12">
        <TextAreaField name="admin_notes" v-model="form" :error="errors.admin_notes" title="Admin Notes" />
      </div>
    </div>

    <div class="mt-5 text-right">
      <SubmitButton :createFunction="validateAndCreate" :loading="loading" />
    </div>
  </div>
</template>
