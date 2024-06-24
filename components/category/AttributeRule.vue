<script setup lang="ts">
import _ from "lodash";
import Button from "~/components/enigma/base-components/Button";
import Lucide from "~/components/enigma/base-components/Lucide";
import Table from "~/components/enigma/base-components/Table";
import { FormSelect } from "~/components/enigma/base-components/Form";
import AddAttributeRule from "./AddAttributeRule.vue";
import LoadingIcon from "~/components/enigma/base-components/LoadingIcon";
import AddAttributeRuleCondition from "./AddAttributeRuleCondition.vue"

const route = useRoute();
const idParem = parseInt(route.params.id.toString());
const { getCategoryRules, addCategoryRule, updateCategoryRule, setArchiveId, deleteConfirmationModal, deleteCategoryRule, errors, loading } = useCategoryRule();
let rules:any = ref([])

const {
    deleteCategoryRuleCondition,
    setArchiveIdC,
    deleteConfirmationModalC,
} = useCategoryRuleCondition()

const modalShow = ref(false);
const setModal = (value: boolean) => {
    modalShow.value = value;
};
const setConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value;
};
const setConfirmationModalC = (value: boolean) => {
    deleteConfirmationModalC.value = value;
};
const refresh = async () => {
    await getCategoryRules(idParem)
}

const attributeRule = ref({ id: 0 })
const modalShowCondition = ref(false);
const setModalCondition = (value: boolean) => {
    modalShowCondition.value = value;
};
const ruleValidationAndAdd = async () => {
    let form = reactive({
        match_type: "any",
    });
    await addCategoryRule(form, idParem)
    validationFocus(form, errors);
    await refresh();
};

const updateRule = async (obj: any) => {
    let form = reactive({
        match_type: obj.match_type,
    });
    await updateCategoryRule(form, idParem, obj.id)
}
const deleteRule = async () => {
    await deleteCategoryRule(idParem)
}
const categoryRuleId = ref(0)
const slideOver = ref(false)
const categoryRuleIdD = ref(0)

const setSlideover = (value: boolean, rule_id: number = 0) => {
    categoryRuleId.value = rule_id
    slideOver.value = value
}
const removeCondition = async (id: number) => {
    await deleteCategoryRuleCondition(categoryRuleIdD.value)
    await refresh()
}
const dataLoaded = ref(false)
onMounted(async () => {
  await nextTick();
  rules = await getCategoryRules(idParem)
  dataLoaded.value = true
});
</script>

<template>
    <div>
        <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                <Button variant="primary" v-if="loading == false" class="mr-2 shadow-md" @click="ruleValidationAndAdd">
                    Create Attribute Rule</Button>
                <Button v-if="loading == true" variant="primary" class="mb-2 mr-1">
                    Saving
                    <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                </Button>
            </div>
            <!-- BEGIN: Data List -->
            <div class="col-span-12 overflow-x-auto intro-y">
                <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">

                    <Table.Thead variant="dark" class="text-xs">
                        <Table.Tr>
                            <Table.Th class="whitespace-nowrap">ATTRIBUTE RULES</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr v-if="!dataLoaded" class="intro-x">
                            <Table.Td class="py-0 px-0">
                            <TableLoading />
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr v-if="rules.length == 0 && dataLoaded" class="intro-x">
                            <Table.Td class="py-0 px-0">
                            <AlertGray />
                            </Table.Td>
                        </Table.Tr>
                        <Table.Tr v-for="rule in rules" class="cursor-pointer intro-x" :key="rule.id">
                            <Table.Td class="px-1 md:px-5">
                                <Table class="border-spacing-y-[10px] border-separate -mt-2 hover">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <FormSelect v-model="rule.match_type" @change="updateRule(rule)">
                                                    <option value="any">Any</option>
                                                    <option value="all">All</option>
                                                </FormSelect>
                                            </td>
                                            <td class="text-right">
                                                <div class="flex items-center justify-end">
                                                    <NuxtLink class="flex ml-3 text-danger cursor-pointer" @click="(event) => {
                                                        event.preventDefault();
                                                        setArchiveId(rule.id);
                                                        setConfirmationModal(true);
                                                        event.stopPropagation();
                                                    }
                                                        ">
                                                        <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                                                        <span class="hidden">Remove</span>
                                                    </NuxtLink>
                                                    <Button @click="setSlideover(true, rule.id)" variant="primary"
                                                        class="mb-2 sm:mb-0 ml-3 shadow-none">
                                                        Add A Condition
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <div class="mt-2 flex items-stretch"
                                                    v-for="condition in rule.category_rule_attributes">
                                                    <div>
                                                        Show products that {{
                                                        condition.matches
                                                            ? "Match"
                                                            : "Don't Match"
                                                      }}
                                                        <b>{{ condition.attribute_option.attribute.name }}</b> = <b>{{
                                                            condition.attribute_option.display }}</b>
                                                    </div>
                                                    <NuxtLink class="ml-3 flex text-danger text-center cursor-pointer"
                                                        @click="(event: any) => {
                                                            event.preventDefault();
                                                            setArchiveIdC(condition.id);
                                                            categoryRuleIdD = rule.id
                                                            setConfirmationModalC(true);
                                                            event.stopPropagation();
                                                        }
                                                            ">
                                                        <Lucide icon="Trash2" class="w-4 h-4 mr-1" />
                                                        <span class="hidden">Remove</span>
                                                    </NuxtLink>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </div>
        </div>
        <Confirmation v-model="deleteConfirmationModal" :setConfirmationModal="setConfirmationModal" :set-id="setArchiveId"
            sub-header="Do you really want to delete this Attribute Rule?" :functionToRun="deleteRule"
            button-string-main="Delete" />
        <AddAttributeRule :set-modal="setModal" :modal-show="modalShow" :refresh="refresh" />

        <Confirmation v-model="deleteConfirmationModalC" buttonStringMain="Remove"
            subHeader="Do you want to remove this attribute rule condition?" :setConfirmationModal="setConfirmationModalC"
            :set-id="setArchiveIdC" :functionToRun="removeCondition" />
        <AddAttributeRuleCondition :category-rule-id="categoryRuleId" :set-slideover="setSlideover" :slide-over="slideOver"
            :refresh="refresh" />
    </div>
</template>