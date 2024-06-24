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
    getLayout,
    getSettingTemplate,
    getDisplayTemplateZoom,
    getDisplayTemplateDetail,
    addUpdateProductSiteSetting,
    getDisplayTemplateThumbnail,
    errors,
    loading,
} = useProductSiteSetting();
let moduleTemplates = ref([]);
let layoutTemplates = ref([]);
let settingTemplate = ref([]);
let zoomDisplay = ref([]);
let detailDisplay = ref([]);
let thumbDisplay = ref([]);
let settingFields = [];
const dataLoaded = ref(false)
const defaultTemplates = [
    { id: 0, name: "Use Site's Setting" },
    { id: 1, name: "Select different option" },
];
const defaultSettingTemplates = [
    { id: 0, name: "None" },
    { id: 1, name: "Select different option" },
];
const fetchData = async () => {
    moduleTemplates = await getModuleTemplate();
    layoutTemplates = await getLayout();
    settingTemplate = await getSettingTemplate();
    zoomDisplay = await getDisplayTemplateZoom();
    detailDisplay = await getDisplayTemplateDetail();
    thumbDisplay = await getDisplayTemplateThumbnail();
    settingFields = [
        {
            name: "settings_template_id",
            options: defaultSettingTemplates,
            option_main: settingTemplate.value,
            title: "Settings Template",
        },
        {
            name: "layout_id",
            option_main: layoutTemplates.value,
            title: "Layout",
        },
        {
            name: "module_template_id",
            option_main: moduleTemplates.value,
            title: "Module Template",
        },
        {
            name: "product_thumbnail_template",
            option_main: thumbDisplay.value,
            title: "Thumbnail Template",
        },
        {
            name: "product_detail_template",
            option_main: detailDisplay.value,
            title: "Detail Template",
        },
        {
            name: "product_zoom_template",
            option_main: zoomDisplay.value,
            title: "Zoom Template",
        },
    ];
    dataLoaded.value = true
}

const {
    setSlideover,
    slideover,
    modelValue: productSiteSetting,
    refreshSetting,
} = toRefs(props);

const getSettingValue = (name) => {
    let value = null;
    if (productSiteSetting.value.settings != null) {
        if (productSiteSetting.value.settings[name + "_default"] == 1) {
            value = productSiteSetting.value.settings[name];
        }
    }
    return value;
};
const getSettingDefaultValue = (name) => {
    let value = null;
    if (productSiteSetting.value.settings != null) {
        value = productSiteSetting.value.settings[name];
    }
    return value;
};
const changeFrom = () => {
    settingFields.forEach((element) => {
        if (form[element.name + `_default`] != 1) {
            form[element.name] = null;
        }
    });
};
let form = reactive({
    site_id: productSiteSetting.value.site_id,
    settings_template_id: getSettingValue("settings_template_id"),
    layout_id: getSettingValue("layout_id"),
    module_template_id: getSettingValue("module_template_id"),
    product_detail_template: getSettingValue("product_detail_template"),
    product_thumbnail_template: getSettingValue("product_thumbnail_template"),
    product_zoom_template: getSettingValue("product_zoom_template"),

    settings_template_id_default: getSettingDefaultValue("settings_template_id_default"),
    layout_id_default: getSettingDefaultValue("layout_id_default"),
    module_template_id_default: getSettingDefaultValue("module_template_id_default"),
    product_detail_template_default: getSettingDefaultValue(
        "product_detail_template_default"
    ),
    product_thumbnail_template_default: getSettingDefaultValue(
        "product_thumbnail_template_default"
    ),
    product_zoom_template_default: getSettingDefaultValue("product_zoom_template_default"),
});


const settingValidationAndEdit = async () => {
    changeFrom();
    await addUpdateProductSiteSetting(form, route.params.id);
    await refreshSetting.value();
    validationFocus(form, errors);
    if (Object.keys(errors).length == 0) {
        setSlideover.value(false);
    }
};
onMounted(async () => {
    await nextTick();
    await fetchData();
})
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
                                :options="settingField.options != undefined ? settingField.options : defaultTemplates"
                                :submit-function="settingValidationAndEdit"
                                :default-option="`Use Default Product ` + settingField.title"
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
