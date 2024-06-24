<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Table from "~/components/enigma/base-components/Table";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  setModel: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  reportData: {
    required: true,
    type: Object,
  },
  report: {
    required: true,
    type: Object,
  }
});
const { setModel, modalShow, reportData,report } = toRefs(props);
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
      }" class="absolute top-3 right-4" href="#">
        <Lucide icon="X" class="w-8 h-8" />
      </a>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Customer Report ({{report.name}})</h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3 max-h-[75vh] overflow-auto">
        <div class="overflow-y-auto col-span-12">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Tr class="intro-x">
                <Table.Td v-for="criteria in reportData.criteria" :key="criteria.id" >
                  {{ criteria }}
                </Table.Td>
            </Table.Tr>
          </Table>
        </div>
        <div class="overflow-y-auto col-span-12 mt-2">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Tr class="intro-x">
                <Table.Td>
                  Total Number of Customer Accounts : {{reportData.total_customer}}
                </Table.Td>
            </Table.Tr>
          </Table>
        </div>  

        <div class="overflow-y-auto col-span-12 mt-2">
          <Table class="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead variant="dark">
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">ACCOUNT ID</Table.Th>
                <Table.Th class="whitespace-nowrap">FIRST NAME</Table.Th>
                <Table.Th class="whitespace-nowrap">LAST NAME</Table.Th>
                <Table.Th class="whitespace-nowrap">USERNAME</Table.Th>
                <Table.Th class="whitespace-nowrap">EMAIL</Table.Th>
                <Table.Th class="whitespace-nowrap">CITY</Table.Th>
                <Table.Th class="whitespace-nowrap">STATE/PROVINCE</Table.Th>
                <Table.Th class="whitespace-nowrap">COUNTRY</Table.Th>
                <Table.Th class="whitespace-nowrap">CREATED</Table.Th>
                <Table.Th class="whitespace-nowrap">LAST LOGIN</Table.Th>
                <Table.Th class="whitespace-nowrap">CURRENT ACCOUNT STATUS</Table.Th>
                <Table.Th class="whitespace-nowrap">CURRENT ACCOUNT TYPE</Table.Th>
                <Table.Th class="whitespace-nowrap">MEMBERSHIP STARTED</Table.Th>
                <Table.Th class="whitespace-nowrap">MEMBERSHIP EXPIRATION</Table.Th>
                <Table.Th class="whitespace-nowrap">MEMBERSHIP LEVEL</Table.Th>
                <Table.Th class="whitespace-nowrap">MEMBERSHIP AMOUNT PAID TOTALS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-if="reportData.collection.length <= 1" class="intro-x">
                <Table.Td colspan="16" class="py-0 px-0">
                  <AlertGray />
                </Table.Td>
              </Table.Tr>
              <Table.Tr v-else v-for="data in reportData.collection" :key="data.id" class="intro-x hover:bg-primary hover:text-white">
                <Table.Td>
                  {{ data.account_id }}
                </Table.Td>
                <Table.Td>
                  {{ data.first_name }}
                </Table.Td>
                <Table.Td>
                  {{ data.last_name }}
                </Table.Td>

                <Table.Td>
                  {{ data.username }}
                </Table.Td>
                <Table.Td>
                  {{ data.email }}
                </Table.Td>
                <Table.Td>
                  {{ data.city }} 
                </Table.Td>
                <Table.Td>
                  {{ data.state }} 
                </Table.Td>
                <Table.Td>
                  {{ data.country }} 
                </Table.Td>
                <Table.Td>
                  {{ formatDate(data.created) }}
                </Table.Td>

                <Table.Td>
                  {{ formatDate(data.last_login) }}
                </Table.Td>
                <Table.Td>
                  {{ data.status }}
                </Table.Td>
                <Table.Td>
                  {{ data.type }}
                </Table.Td>

                <Table.Td>
                  {{ formatDate(data.membership_start) }}
                </Table.Td>
                <Table.Td>
                  {{ formatDate(data.membership_end) }}
                </Table.Td>
                <Table.Td>
                  {{ data.membership_level }}
                </Table.Td>
                <Table.Td>
                  {{ data.membership_paid }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </Dialog.Description>

    </Dialog.Panel>
  </Dialog>
</template>
