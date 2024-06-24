<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";
import DatePickerField from "~/components/form/DatePickerField.vue";

const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
});
const router = useRouter();
const { createDiscount, errors, loading } = useDiscount();
const { setModal, modalShow } = toRefs(props);

let form = reactive({
  name: null,
  display: null,
  start_date: null,
  exp_date: null,
  limit_uses: 1,
  limit_per_order: 0,
  limit_per_customer: 0
});

const discountValidationAndAdd = async () => {
  const discount: any = await createDiscount(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    setTimeout(function () {
      router.push("/catalog/discounts/" + discount.id);
    }, 1000);
  }
};
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" size="xl" @close="() => {
    setModal(false);
  }
    ">
    <Dialog.Panel>
      <a @click="(event) => {
        event.preventDefault();
        setModal(false);
      }
        " class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Add Discount</h2>
      </Dialog.Title>

      <Dialog.Description>
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
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="discountValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
