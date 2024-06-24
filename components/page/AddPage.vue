<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton } from "~/components/form";

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
const { addPage, errors, loading } = usePages();
const { setModal, modalShow } = toRefs(props);

let form = reactive({
  title: null,
  url_name: null,
});

const pageValidationAndAdd = async () => {
  const page = await addPage(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    setModal.value(false);
    setTimeout(function () {
      router.push("/content/pages/" + page.id);
    }, 1000);
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
        <h2 class="mr-auto text-base font-medium">Add Page</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div>
          <InputField name="title" type="text" v-model="form" :error="errors.title" title="Title" />
        </div>
        <div class="mt-3">
          <InputField name="url_name" type="text" v-model="form" :error="errors.url_name" title="Url Slug" />
        </div>
      </Dialog.Description>
      <Dialog.Footer>
        <SubmitButton :createFunction="pageValidationAndAdd" :loading="loading" />
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
