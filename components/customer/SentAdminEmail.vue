<script setup lang="ts">
import { ref, toRefs, type PropType } from "vue";
import {
  Dialog,
} from "~/components/enigma/base-components/Headless";
import {
  InputField,
  SelectField,
  SubmitButton,
  CancelButton,
  EditorField
} from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide";

const props = defineProps({
  fetchList: {
    required: true,
    type: Function,
  },
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  order: {
    required: false,
    type: Object,
    default: null
  },
  modelValue: {
    required: true,
    type: Object,
  },
});

const {
  fetchList,
  setModal,
  modalShow,
  order,
  modelValue: customer
} = toRefs(props);

const { messageTemplates } = useAccountType()
const { getMessageTemplate } = useMessageTemplates()
const { loading, errors, createAdminEmails } = useAdminEmailToCustomer();

let formData = reactive({
  message_template_id: null,
  subject: null,
  body: "",
  order_id: order.value ? order.value.id : null,
  account_id: customer.value.id,
});

const sentEmail = async () => {
  await createAdminEmails(formData);
  validationFocus(formData, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    fetchList.value();
  }
};
const key = ref(0);
const loadTemplate = async (templateId: number) => {
  const messageTemplate = await getMessageTemplate(templateId,
    customer.value.id ? customer.value.id : 0,
    customer.value.site_id ? customer.value.site_id : 0,
    order.value ? order.value.id : 0,
    order.value && order.value.affiliate_id ? order.value.affiliate_id : 0,)

  formData.subject = messageTemplate.value.subject
  formData.body = decodeHtml(messageTemplate.value.html_body)
  key.value += 1
}
let templates:any = ref([]);
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  templates = await messageTemplates();
  dataLoaded.value = true
});
</script>

<template>
  <Dialog backdrop="static" size="xl" :open="modalShow" @close="() => {
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
        <h2 class="mr-auto text-base font-medium">Contact Customer</h2>
      </Dialog.Title>

      <Dialog.Description class="max-h-[75vh] overflow-auto">
        <div class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="mt-3 col-span-12 intro-y">
            <div v-if="!dataLoaded" class="absolute inset-0 flex items-center justify-center  bg-opacity-50">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
            <SelectField v-if="dataLoaded" :options="templates" :submit-function="sentEmail" name="message_template_id" v-model="formData"
              :error="errors.message_template_id" :runFunction="loadTemplate" title="Load a Message Template" />
          </div>
          <div class="col-span-12 mt-3 intro-y">
            <InputField :submit-function="sentEmail" :key="key" name="subject" v-model="formData"
              :error="errors.subject" title="Subject" />
          </div>
          <div class="col-span-12 mt-3 intro-y">
            <EditorField name="body" v-model="formData" :key="key" :error="errors.body" title="Message" />
          </div>
        </div>

      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="sentEmail" buttonText="Send" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
