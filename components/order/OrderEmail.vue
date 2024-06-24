<script setup lang="ts">
import _ from "lodash";
import { toRefs } from "vue";
import Table from "~/components/enigma/base-components/Table";
import Button from "~/components/enigma/base-components/Button";
import SentAdminEmail from "../customer/SentAdminEmail.vue";
import EmailContent from "../customer/EmailContent.vue";
import { SubmitButton } from "~/components/form";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
});
let { modelValue: order } = toRefs(props);
const { getOrderEmails, sentEmail, loadingEmail } = useOrderEmails();
const orderId = order.value.id;
const modalShow = ref(false);
const setModel = (value: boolean) => {
  modalShow.value = value;
};
const content = ref("")
const contentShow = ref(false);
const setContentAndShowModel = (value: string) => {
  content.value = value;
  setContentModel(true)
};
const setContentModel = (value: boolean) => {
  contentShow.value = value;
};

const fetchList = async () => {
  await getOrderEmails(orderId)
}
const sendOrderEmail = async () => {
  await sentEmail(orderId);
}

const dataLoaded = ref(false)
let emails: any = ref([]);
let lastPage: any = ref(1);
let currentPage: any = ref(1);


const fetchData = async () => {
  const result = await getOrderEmails(orderId)
  emails = result.emails;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  dataLoaded.value = true
}
onMounted(async () => {
  await nextTick();
  await fetchData();
});


</script>

<template>
  <div class="p-1">
    <Button variant="primary" class="mr-2 mb-3 shadow-md" @click="setModel(true)">
      Contact Customer
    </Button>
    <SubmitButton :createFunction="sendOrderEmail" buttonLoading="Sending..." buttonText="Email Order To Customer"
      :loading="loadingEmail" />
    <div class="overflow-y-auto col-span-12">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th class="whitespace-nowrap">TO</Table.Th>
            <Table.Th class="whitespace-nowrap">SUBJECT</Table.Th>
            <Table.Th class="whitespace-nowrap">SENT BY</Table.Th>
            <Table.Th class="whitespace-nowrap">STATUS</Table.Th>
            <Table.Th class="whitespace-nowrap">DATE</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="emails.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="5" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="email in emails" :key="email.id" class="intro-x">
            <Table.Td>
              {{ email.sent_to }}
            </Table.Td>
            <Table.Td>
              <div class="flex flex-col">
                <div class="mb-2">{{ email.subject }}</div>
                <Button variant="primary" class="mr-2 mt-2 mb-2 shadow-md"
                  @click="setContentAndShowModel(email.content)">
                  View Content
                </Button>
              </div>

            </Table.Td>
            <Table.Td>
              {{ email.sent_by ? email.sent_by.name : "" }}
            </Table.Td>
            <Table.Td>
              {{ email.status }}
            </Table.Td>
            <Table.Td>
              {{ formatDateTime(email.sent_date) }}
            </Table.Td>

          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <PaginationModal v-model="currentPage" v-if="dataLoaded" :getList="fetchList" :numberOfPages="lastPage" />
  </div>
  <SentAdminEmail :modal-show="modalShow" :order="order" v-model="order.account" :set-modal="setModel"
    :fetchList="fetchList" />
  <EmailContent :modal-show="contentShow" v-model="content" :set-modal="setContentModel" />
</template>
