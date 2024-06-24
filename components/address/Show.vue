<script setup lang="ts">
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import Button from "~/components/enigma/base-components/Button";

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  },
  editAddress: {
    required: false,
    type: Function,
  },
});

const { modelValue: address, editAddress } = toRefs(props);
</script>

<template>
  <div class="rounded-md p-5 space-y-4 text-left">
    <div class="space-y-2">
      <a href="" class="block text-lg font-semibold text-blue-600">
        {{ address.label }}
      </a>
      <div class="text-gray-600 font-medium">
        {{ address.first_name }} {{ address.last_name }}
      </div>
      <div v-if="address.company" class="text-gray-500 text-sm">
        {{ address.company }}
      </div>
    </div>

    <div class="text-gray-600 space-y-1">
      <div>
        {{ address.address_1 }}
      </div>
      <div v-if="address.address_2">
        {{ address.address_2 }}
      </div>
      <div>
        {{ address.city }}{{ address.state_province ? ", " + address.state_province.name : "" }} {{ address.postal_code }}
      </div>
      <div v-if="address.country" class="font-medium">
        {{ address.country?.name }}
      </div>
    </div>

    <div class="space-y-2">
      <div v-if="address.email" class="flex items-center text-gray-500">
        <Lucide icon="Mail" class="w-4 h-4 mr-2 text-blue-500" />
        {{ address.email }}
      </div>
      <div v-if="address.phone" class="flex items-center text-gray-500">
        <Lucide icon="Phone" class="w-4 h-4 mr-2 text-blue-500" />
        {{ address.phone }}
      </div>
    </div>

    <Button
      variant="primary"
      v-if="editAddress != undefined"
      @click="() => { editAddress!(true); }"
      class="px-3 py-2 mt-4"
    >
      Edit
    </Button>
  </div>
</template>
