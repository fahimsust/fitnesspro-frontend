<script lang="ts" setup>
import { SelectField, SubmitButton } from "~/components/form";
const props = defineProps({
    setProduct: {
        required: true,
        type: Function,
    },
    search_option:{
        required:true,
        type:String,
    },
    errors:{
        required:true,
        type:Object,
    },
    loading:{
        required:true,
        type:Boolean,
    },
    addSearchText:{
        required:true,
        type:Function
    }
});
const { setProduct,search_option,errors,loading,addSearchText } = toRefs(props);
const { getOrderingRules } = useProductPricing();
let orderingRules:any = ref([])

const saveSearchText = () => {
  const keyword = orderingRules.value.find((col: any) => col.id === form.ordering_rule_id);
  if (keyword) {
    const replaceObj = {keyKeyword:keyword.name}
    addSearchText.value(replaceObj);
  }
}
let form = reactive({
    'search_option': search_option.value,
    'ordering_rule_id': null
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  orderingRules = await getOrderingRules()
  dataLoaded.value = true
});
</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="orderingRules"
      default-option="Select Ordering Rule"
      :with-label="false"
      name="ordering_rule_id"
      v-model="form"
      v-if="dataLoaded"
      :error="errors.ordering_rule_id"
      title="Ordering Rule"
    />
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>