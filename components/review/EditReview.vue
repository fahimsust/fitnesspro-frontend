<script lang="ts" setup>
import { toRefs } from "vue";
import { Dialog } from "~/components/enigma/base-components/Headless";
import Rating from "./Rating.vue";
import { InputField, SubmitButton, CancelButton, TextAreaField } from "~/components/form";
import Lucide from "~/components/enigma/base-components/Lucide";
const props = defineProps({
  setModal: {
    required: true,
    type: Function,
  },
  modalShow: {
    required: true,
    type: Boolean,
  },
  refreshReview: {
    required: true,
    type: Function,
  },
  modelValue: {
    required: true,
    type: Object,
  },
});
const { updateReview, errors, loading } = useReviews();
const { setModal, modelValue: review, modalShow, refreshReview } = toRefs(props);
let form = reactive({
  name: review.value.name,
  comment: review.value.comment,
  rating: review.value.rating,
});
const rating = ref(review.value.rating);
const reviewValidationAndUpdate = async () => {
  form.rating = rating;
  await updateReview(form, review.value.id);
  await refreshReview.value();
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
  }
};
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
        <h2 class="mr-auto text-base font-medium">Edit Review</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="name" type="text" v-model="form" :error="errors.name"
            :submit-function="reviewValidationAndUpdate" title="Name" />
        </div>
        <div class="mt-3">
          <TextAreaField name="comment" v-model="form" :error="errors.name" title="Comment" />
        </div>
        <div class="mt-3">
          <div class="mb-2">Rating</div>
          <Rating v-if="rating != undefined" v-model="rating" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="reviewValidationAndUpdate" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
