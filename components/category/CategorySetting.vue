<script setup>
import { toRefs } from "vue";
import Lucide from "~/components/enigma/base-components/Lucide";
import { Slideover } from "~/components/enigma/base-components/Headless";
import { CancelButton, SelectField, SubmitButton } from "~/components/form";

const route = useRoute();
const props = defineProps({
    setSlideover: {
        required: true,
        type: Function,
    },
    slideover: {
        required: true,
        type: Boolean,
    },
    modelValue: {
        required: true,
        type: Object,
    },
    refreshSetting: {
        required: true,
        type: Function,
    },
});
const emit = defineEmits(["update:modelValue"]);
const {
    getModuleTemplate,
    addUpdateCategorySiteSetting
} = useProductSiteSetting();
const {
    getSettingTemplate,
} = useCategorySiteSetting();
let moduleTemplates = ref([]);
let settingTemplate = ref([]);
const defaulSeiingTemplates = [
    { id: 0, name: "None" },
    { id: 1, name: "Select different option" },
];
const defaultModuleTemplates = [
    { id: 0, name: "Use Site's Module Template" },
    { id: 1, name: "Select different option" },
];
const {
    setSlideover,
    slideover,
    modelValue: categorySiteSetting,
    refreshSetting,
} = toRefs(props);

const getSettingValue = (name) => {
    let value = null;
    if (categorySiteSetting.value.settings != null) {
        if (categorySiteSetting.value.settings[name + "_default"] == 1) {
            value = categorySiteSetting.value.settings[name];
        }
    }
    return value;
};
const getSettingDeafultValue = (name) => {
    let value = null;
    if (categorySiteSetting.value.settings != null) {
        value = categorySiteSetting.value.settings[name];
    }
    return value;
};
const changeForm = () => {
    settingFields.forEach((element) => {
        if (form[element.name + `_default`] != 1) {
            form[element.name] = null;
        }
    });
};
let form = reactive({
    site_id: productSiteSetting.value.site_id,
    settings_template_id: getSettingValue("settings_template_id"),
    module_template_id: getSettingValue("module_template_id"),
    settings_template_id_default: getSettingDeafultValue("settings_template_id_default"),
    module_template_id_default: getSettingDeafultValue("module_template_id_default"),
});
const settingFields = [
    {
        name: "settings_template_id",
        options: defaulSeiingTemplates,
        option_main: settingTemplate.value,
        title: "Category Settings",
    },
    {
        name: "module_template_id",
        option_main: moduleTemplates.value,
        title: "Module Template",
    },
];

const settingValidationAndEdit = async () => {
    changeForm();
    await addUpdateCategorySiteSetting(form, route.params.id);
    await refreshSetting.value();
    validationFocus(form, errors);
    if (Object.keys(errors).length == 0) {
        setSlideover.value(false);
    }
};
const dataLoaded = ref(false)
onMounted(async () => {
    await nextTick();
    moduleTemplates = await getModuleTemplate();
    settingTemplate = await getSettingTemplate();
    dataLoaded.value = true
});
</script>
<template>
    <Slideover backdrop="static" :open="slideover" @close="setSlideover(false)">
        <Slideover.Panel>
            <a @click="(event) => {
                event.preventDefault();
                setSlideover(false);
            }" class="absolute top-3 right-4" href="#">
                <Lucide icon="X" class="w-8 h-8" />
            </a>
            <Slideover.Title>
                <h2 class="mr-auto text-base font-medium">Site Setting</h2>
            </Slideover.Title>

            <Slideover.Description>
                <div v-if="!dataLoaded">
                    <div class="rounded-lg box intro-y mt-3">
                        <TableLoading />
                    </div>
                </div>
                <div v-if="dataLoaded">
                    <div class="border p-3 m-2" v-for="settingField in settingFields">
                        <div>
                            <SelectField
                                :options="settingField.options != undefined ? settingField.options : defaultModuleTemplates"
                                :submit-function="settingValidationAndEdit"
                                :default-option="`Use Default ` + settingField.title"
                                :name="settingField.name + `_default`" v-model="form"
                                :error="errors[settingField.name + `_default`]" :title="settingField.title" />
                        </div>
                        <div class="p-3 bg-slate-100" v-if="form[settingField.name + `_default`] == 1">
                            <SelectField :required="true" :submit-function="settingValidationAndEdit"
                                :options="settingField.option_main" default-option="Select Template"
                                :name="settingField.name" v-model="form" :error="errors[settingField.name]"
                                :title="`Other ` + settingField.title" />
                        </div>
                    </div>
                </div>
            </Slideover.Description>
            <Slideover.Footer>
                <CancelButton :cancelFunction="setSlideover" />
                <SubmitButton :createFunction="settingValidationAndEdit" :loading="loading" />
            </Slideover.Footer>
        </Slideover.Panel>
    </Slideover>
</template>
