<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { SelectField, SubmitButton, CancelButton } from "~/components/form";


const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refresh: {
    required: true,
    type: Function,
  },
});
const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { addSiteSubscriptionPaymentMethod, errors, loading } = useSitePaymentMethodSubscription();
const { getPaymentMethods } = usePaymentMethod();
const { getPaymentAccounts } = usePaymentAccount();
let paymentAccounts: any = [];
const { setModal, modalShow, refresh } = toRefs(props);

const keyAccount = ref(0)
const getPaymentAccountsFromMethod = async () => {
  if (form.payment_method_id) {
    paymentAccounts = await getPaymentAccounts(form.payment_method_id)
    keyAccount.value = form.payment_method_id
  }
  else {
    paymentAccounts = []
    keyAccount.value = 0
  }
}

let form = reactive({
  payment_method_id: null,
  gateway_account_id: null,
});

const paymentMethodValidationAndAdd = async () => {
  await addSiteSubscriptionPaymentMethod(form, idParem);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value()
    setModal.value(false)
  }
};
let paymentMethods:any = ref([]);
const dataLoaded = ref(false)
onMounted(async()=>{
  await nextTick();
  paymentMethods = await getPaymentMethods();
  dataLoaded.value = true
})
</script>
<template>
  <Dialog backdrop="static" :open="modalShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Add Payment Method</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div v-if="dataLoaded">
          <SelectField :options="paymentMethods" name="payment_method_id" type="text" v-model="form"
            :error="errors.payment_method_id" :runFunction="getPaymentAccountsFromMethod" title="Payment Method" />
        </div>
        <div class="mt-3" :key="keyAccount">
          <SelectField :options="paymentAccounts" name="gateway_account_id" type="text" v-model="form"
            :error="errors.gateway_account_id" title="Gateway Account" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="paymentMethodValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
