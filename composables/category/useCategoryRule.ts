export const useCategoryRule = () => {
    const deleteConfirmationModal = ref(false);
    let archiveId = 0;
    let loading = ref(false);
    const errors: { [key: string]: any } = reactive({});

    async function getCategoryRules(id: number) {
        const list: any = await useAsyncData("categoryRules", () =>
            $larafetch(`category/${id}/rule`)
        );
        return list.data;
    }

    async function addCategoryRule(formData: object, id: number) {
        loading.value = true;
        let result: any = {}
        try {
            result = await submitRequest(
                $larafetch(`/category/${id}/rule`, {method: "post", body: formData}),
                (_: any) => {
                    clearValidationErrors(errors);
                    swalTopEnd(
                        "Added Successfully",
                        `Category rule Added successfully`,
                        "success"
                    );
                },
                (validationErrors) => {
                    if (validationErrors) {
                        clearValidationErrors(errors);
                        addValidationErrors(errors, validationErrors);
                        swalTopEnd("Failed", `Please solve the errors`, "error");
                    }
                },
                () => (loading.value = false)
            );
        } catch (error: any) {
            swalTopEnd(
                "",
                error.data?.message,
                "error",
                5000,
            );
        }
        return result.data;
    }

    async function deleteCategoryRule(id: number) {
        try {
            await $larafetch(`/category/${id}/rule/${archiveId}`, {
                method: "delete",
            })
            swalTopEnd(
                "Deleted Successfully",
                `Rule successfully removed from category`,
                "success"
            );
        } catch (error: any) {
            swalTopEnd(
                "",
                error.data?.message,
                "error",
                3000
            );
        }
        deleteConfirmationModal.value = false;
        await getCategoryRules(id);
    }

    async function updateCategoryRule(formData: object, id: number, rule_id: number) {
        loading.value = true;
        let result: any = {}
        try {
            result = await submitRequest(
                $larafetch(`/category/${id}/rule/${rule_id}`, {method: "put", body: formData}),
                (_: any) => {
                    clearValidationErrors(errors);
                    swalTopEnd(
                        "Updated Successfully",
                        `Rule Updated successfully`,
                        "success"
                    );
                },
                (validationErrors) => {
                    if (validationErrors) {
                        clearValidationErrors(errors);
                        addValidationErrors(errors, validationErrors);
                        swalTopEnd("Failed", `Please solve the errors`, "error");
                    }
                },
                () => (loading.value = false)
            );
        } catch (error: any) {
            swalTopEnd(
                "",
                error.data?.message,
                "error",
                5000,
            );
        }
        return result.data;
    }

    function setArchiveId(id: number) {
        archiveId = id;
    }

    return {
        setArchiveId,
        getCategoryRules,
        addCategoryRule,
        deleteCategoryRule,
        updateCategoryRule,
        errors,
        loading,
        deleteConfirmationModal,
    };
};
