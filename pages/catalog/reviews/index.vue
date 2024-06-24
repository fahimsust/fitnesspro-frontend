<script setup lang="ts">
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import EditReview from "~~/components/review/EditReview.vue";
import { FormSwitch } from "~~/components/enigma/base-components/Form";
import { useQueryParamStore } from "~/store/enigma/query-param";

definePageMeta({
  middleware: ["auth"],
  layout: "simple-menu-new",
});
useHead({
  title: "Reviews: " + useRuntimeConfig().public.company,
});

useQueryParamStore().setQueryParam({})
const {
  setDeleteId,
  list,
  deleteReview,
  statusChange,
  deleteConfirmationModal,
} = useReviews();

const dataLoaded = ref(false)
let reviews:any = ref([]);
let lastPage:any = ref(1);
let currentPage:any = ref(1);
let keywordString:any = ref('');
let itemIdString:any = ref('');
let orderBy: any = ref('');
let orderType: any = ref('');

const fetchData = async ()=>{
  const result = await list();
  reviews = result.reviews;
  lastPage = result.lastPage;
  currentPage = result.currentPage;
  keywordString = result.keywordString;
  itemIdString = result.itemIdString;
  orderBy = result.orderBy;
  orderType = result.orderType;
  dataLoaded.value = true
}

const fetchList = async () => {
  await list();
};

const changeStatus = async (value: boolean, id: number) => {
  await statusChange(value, id);
};
const searchByKeyword = async (value: any) => {
  createNewPathAndPush("keyword", value, true);
  await fetchList();
};
const searchByItemId = async (value: any) => {
  createNewPathAndPush("item_id", value, true);
  await fetchList();
};

const setConfirmationModal = (value: boolean) => {
  deleteConfirmationModal.value = value;
};
const modalShow = ref(false);
const review = ref({ id: 0 });
const setReviewAndOpenModal = (obj: any) => {
  review.value = obj;
  setModal(true);
};
const setModal = (value: boolean) => {
  modalShow.value = value;
};
onMounted(async () => {
  await nextTick();
  await fetchData();
});
const listFetch = async()=>{
  currentPage.value = 1
  await list();
}
const headerColumns = ref([
  { label: 'REVIEWED', field: '', sortable: false },
  { label: 'RATING', field: 'rating', sortable: true },
  { label: 'NAME', field: 'name', sortable: true },
  { label: 'COMMENT', field: 'comment', sortable: true },
  { label: 'APPROVED', field: 'approved', sortable: true },
  { label: 'CREATED', field: 'created', sortable: true },
  { label: '', field: '', sortable: false, extraClass: "text-center" },
]);
const changeOrder = async (order_by: string) => {
  await changeOrderBy(order_by, orderBy, orderType, listFetch);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <h2 class="text-lg font-medium intro-y">Reviews</h2>
      <div class="hidden mx-auto md:block text-slate-500">
        <!-- Showing 1 to 10 of 150 entries -->
      </div>
      <div class="w-full mt-3 mr-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="itemIdString" :searchByKeyword="searchByItemId"
            placeholder="ID (attribute value or product)" />
        </div>
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <EnterSearch v-model="keywordString" :searchByKeyword="searchByKeyword" placeholder="Keyword(s)" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-x-auto intro-y">
      <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
        <SortableTableHeader :columns="headerColumns" :orderBy="orderBy" :orderType="orderType"
          :handleSort="changeOrder" :v-if="dataLoaded" />
        <Table.Tbody>
          <Table.Tr v-if="!dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <TableLoading />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-if="reviews.length == 0 && dataLoaded" class="intro-x">
            <Table.Td colspan="7" class="py-0 px-0">
              <AlertGray />
            </Table.Td>
          </Table.Tr>
          <Table.Tr v-for="review in reviews" class="cursor-pointer intro-x" :key="review.id"
            @click="setReviewAndOpenModal(review)">
            <Table.Td>
              {{
                review.item_type == 1
                ? "Attribute: " + review.item.display
                : "Product: " + review.item.title
              }}</Table.Td>
            <Table.Td>
              {{ review.rating }}
            </Table.Td>
            <Table.Td>
              {{ review.name }}
            </Table.Td>
            <Table.Td>
              {{ review.comment }}
            </Table.Td>
            <Table.Td>
              <FormSwitch.Input type="checkbox" :key="review.approved" v-model="review.approved" @click="(event: any) => {
                event.preventDefault();
                changeStatus(!review.approved, review.id);
                event.stopPropagation();
              }
                " />
            </Table.Td>
            <Table.Td>
              {{ review.created }}
            </Table.Td>

            <Table.Td>
              <div class="flex items-center justify-center">
                <NuxtLink class="flex text-danger cursor-pointer" @click="(event) => {
                  event.preventDefault();
                  setDeleteId(review.id);
                  setConfirmationModal(true);
                  event.stopPropagation();
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
    </div>
    <!-- END: Data List -->

    <Pagination v-model="currentPage" :key="currentPage" v-if="dataLoaded" :getList="list" :numberOfPages="lastPage" />
  </div>
  <!-- BEGIN: Delete Confirmation Modal -->
  <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setDeleteId"
    button-string-main="Delete" sub-header="Do you really want to delete this Review?" :functionToRun="deleteReview" />
  <EditReview v-if="review.id > 0" :key="review.id" v-model="review" :refresh-review="fetchList" :modal-show="modalShow"
    :set-modal="setModal" />
</template>
