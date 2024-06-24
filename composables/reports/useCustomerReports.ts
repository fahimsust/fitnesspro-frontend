export const useCustomerReports = () => {
    const route = useRoute();
    const page = route.query.page;
    const keyword = route.query.keyword;
    const order_by = route.query.order_by;
    const order_type = route.query.order_type;
    const keywordString = ref(typeof keyword == "string" ? keyword : "");
    const orderBy = ref(typeof order_by == "string" ? order_by : 'id');
    const orderType = ref(typeof order_type == "string" ? order_type : "desc");
    const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
    const errors: { [key: string]: any } = reactive({});
    let loading = ref(false);
    const deleteConfirmationModal = ref(false);
    const reBuildConfirmationModal = ref(false);
    const deleteId = ref(0);
    const rebuildId = ref(0);
  
    async function list() {
      const reportList: any = await useAsyncData("customerReports", () =>
        $larafetch(
          `/report/customer?page=${currentPage.value}&keyword=${
            keywordString.value
          }&order_by=${
            orderBy.value
          }&order_type=${
            orderType.value
          }&per_page=${useRuntimeConfig().public.perPage}`
        )
      );
      const reports = computed(() => reportList.data.value.data);
      const lastPage = computed(() => reportList.data.value.last_page);
      return {
        reports,
        lastPage,
        currentPage,
        keywordString,
        orderBy,
        orderType
      };
    }
    async function getReport(id: number) {
      loading.value = true
      const result: any = await useAsyncData(
          'reportView',
          () => $larafetch(`/report/customer/${id}`),
      )
      loading.value = false
      return result.data
  }
    async function deleteReport() {
      try {
        await $larafetch(`/report/customer/${deleteId.value}`, { method: "delete" });
        swalTopEnd(
          "Deleted Successfully",
          `Report successfully deleted`,
          "success"
        );
      } catch (error: any) {
        swalTopEnd("", error.data?.message, "error", 10000);
      }
      deleteConfirmationModal.value = false;
      const { reports } = await list();
      if (reports.value.length == 0) {
        if (currentPage.value > 1) {
          createNewPathAndPush("page", (currentPage.value - 1).toString(), true);
          currentPage.value = currentPage.value - 1;
          await list();
        }
      }
    }
    async function rebuildReport() {
      loading.value = true;
      await submitRequest(
        $larafetch(`/report/customer/${rebuildId.value}`, { method: "put", body: [] }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Building",
            `Building Report...`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Build failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
      reBuildConfirmationModal.value = false
    }
    async function createReport(formData: object) {
      loading.value = true;
      const result: any = await submitRequest(
        $larafetch("/report/customer/", { method: "post", body: formData }),
        (_: any) => {
          clearValidationErrors(errors);
          swalTopEnd(
            "Created Successfully",
            `Report created successfully`,
            "success"
          );
        },
        (validationErrors) => {
          if (validationErrors) {
            clearValidationErrors(errors);
            addValidationErrors(errors, validationErrors);
            swalTopEnd("Create failed", `Please solve the errors`, "error");
          }
        },
        () => (loading.value = false)
      );
      return result.data;
    }
    function setDeleteId(id: number) {
      deleteId.value = id;
    }
    function setRebuildId(id: number) {
      rebuildId.value = id;
    }
  
    return {
      list,
      deleteReport,
      createReport,
      errors,
      loading,
      deleteConfirmationModal,
      reBuildConfirmationModal,
      setDeleteId,
      rebuildReport,
      getReport,
      setRebuildId,
    };
  };
  