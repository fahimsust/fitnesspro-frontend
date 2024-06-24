<script setup lang="ts">
import _ from "lodash";
import { reactive } from "vue";
import { InputField } from "~/components/form";


const {errors, updateAdvantage, getAdvantage } = useDiscountAdvantage();
  const props = defineProps({
    advantage: {
      required: true,
      type: Object
    }
  });
const { advantage } = toRefs(props);
let formEdit = reactive({
  amount: advantage.value.amount,
});
const updated = ref(false)
const validateAndUpdate = async () => {
  if(updated.value)
  {
    await updateAdvantage(formEdit,advantage.value.id);
    validationFocus(formEdit, errors);
    await getAdvantage(advantage.value.id);
    updated.value = false
  }
};
</script>

<template>
      <div  class="col-span-12 intro-y md:col-span-3">
        <InputField :change="()=>updated=true" :blur="validateAndUpdate" :submitFunction="validateAndUpdate" name="amount" v-model="formEdit" :error="errors.amount"
          title="Amount Off"  />
      </div>
</template>