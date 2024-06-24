<script lang="ts" setup>
import { ref ,reactive} from 'vue';
import { SelectField, SubmitButton } from "~/components/form";
import { Disclosure } from "~/components/enigma/base-components/Headless";
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
    reload_child:{
        required:false,
        type:Function,
        default:()=>{}
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
const { setProduct,search_option,errors,loading,reload_child,addSearchText } = toRefs(props);
const { attributeSets } = useProductType();
let setList:any = ref([])
const {attributes} = useAttribute();
let attributeList:any = ref([]);

let form = reactive({
    'search_option': search_option.value,
    'set_id': null,
    'attributeList':[]
});
const validateAndSearch = async()=>{
    saveSearchText();
    await setProduct.value(form)
}
const getAttributeList = () => {
    let resultMap: { [key: string]: string[] } = {};

    form.attributeList.forEach((optionId: number) => {
        let attributeItem = attributeList.value.find((attribute: any) => {
            return attribute.options.some((option: any) => option.id === optionId);
        });

        if (attributeItem) {
            let optionItem = attributeItem.options.find((option: any) => option.id === optionId);
            if (optionItem) {
                if (!resultMap[attributeItem.name]) {
                    resultMap[attributeItem.name] = [];
                }
                resultMap[attributeItem.name].push(optionItem.display);
            }
        }
    });

    let result: string[] = [];
    for (let attributeName in resultMap) {
        
        result.push(`<span class="text-orange-600 dark:text-orange-300">${attributeName}:</span> ${resultMap[attributeName].join(', ')}`);
    }

    return result.join(', ');
};

const saveSearchText = () => {
  const keyword = getAttributeList();
  if (keyword) {
    const replaceObj = {keyKeyword:keyword}
    addSearchText.value(replaceObj);
  }
}

const keyDisclouse = ref(0)
const getAttributes = async(set_id:any)=>{
    if(set_id)
    {  
        attributeList = await attributes(set_id)
        keyDisclouse.value = set_id
    }
    else
    {
        attributeList = []
        keyDisclouse.value = set_id
    }
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  setList = await attributeSets()
  dataLoaded.value = true
});

</script>
<template>
    <div v-if="!dataLoaded">
        <TableLoading />
    </div>
    <SelectField
      :options="setList"
      default-option="Select Attribute Set"
      name="set_id"
      v-if="dataLoaded"
      v-model="form"
      :error="errors.set_id"
      title="Attribute Set"
      :run-function="getAttributes"
    />
        <Disclosure.Group
            variant="boxed"
            :key="keyDisclouse"
            class="mt-5"
          >

            <Disclosure
              v-for="attribute in attributeList"
              :key="attribute.id"
            >
              <Disclosure.Button>
                <b>{{ attribute.name }}</b>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div class="grid grid-cols-12 gap-6 mt-5 box p-5">
                    <div class="col-span-6 p-2 border md:col-span-4 lg:col-span-3" v-for="option in attribute.options">
                        <input type="checkbox" v-model="form['attributeList']" :value="option.id">&nbsp;&nbsp;&nbsp;{{ option.display }}
                    </div>
                </div>
              </Disclosure.Panel>
            </Disclosure>
        </Disclosure.Group>
    <div class="mt-5 text-right">
        <SubmitButton  buttonText="Search" buttonLoading="Searching" :createFunction="validateAndSearch" :loading="loading" />
    </div>
</template>