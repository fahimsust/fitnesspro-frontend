<script lang="ts" setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover, Dialog } from "~/components/enigma/base-components/Headless";
import { InputField, SubmitButton, CancelButton, SelectField } from "~/components/form";
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
  }
});
const { createDisplayTemplate, errors, loading, getDisplayTemplateTypes } = useDisplayTemplates();
const { setModal, modalShow, refresh } = toRefs(props);
let displayTypes:any = ref([]);
let form = reactive({
  name: null,
  include: null,
  image_width: null,
  image_height: null,
  type_id: null,
});
const displayTemplatedUpdate = async () => {
  await createDisplayTemplate(form);
  validationFocus(form, errors);
  if (Object.keys(errors).length == 0) {
    await refresh.value();
    setModal.value(false);
  }
};
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  displayTypes = await getDisplayTemplateTypes();
  dataLoaded.value = true
});
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
        <h2 class="mr-auto text-base font-medium">Add Display Template</h2>
      </Dialog.Title>

      <Dialog.Description>
        <div v-if="!dataLoaded">
          <div class="rounded-lg box intro-y mt-3">
            <TableLoading />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 gap-y-3" v-if="dataLoaded">
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="displayTemplatedUpdate" name="name" v-model="form" :error="errors.name"
              title="Name" :required="true" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="displayTemplatedUpdate" name="include" v-model="form" :error="errors.include"
              title="Include" :required="true" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="displayTemplatedUpdate" name="image_width" v-model="form"
              :error="errors.image_width" title="Image Width" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <InputField :submit-function="displayTemplatedUpdate" name="image_height" v-model="form"
              :error="errors.image_height" title="Image Height" />
          </div>
          <div class="col-span-6 xs:col-span-12">
            <SelectField :options="displayTypes" :submit-function="displayTemplatedUpdate" name="type_id" v-model="form"
              :error="errors.type_id" title="Type" :required="true" />
          </div>

        </div>
      </Dialog.Description>
      <Slideover.Footer>

        <SubmitButton :createFunction="displayTemplatedUpdate" :loading="loading" />
      </Slideover.Footer>
    </Dialog.Panel>
  </Dialog>
</template>
