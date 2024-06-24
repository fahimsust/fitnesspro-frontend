export const useReferrals = () => {
  const route = useRoute();
  const page = route.query.page;
  const keyword = route.query.keyword;
  const status = route.query.status;
  const name = route.query.name;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  const referralStatus = ref(typeof status == "string" ? status : "");
  const nameString = ref(typeof name == "string" ? name : "");
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");
  async function list() {
    let paramString: String = "";
    if (referralStatus.value && referralStatus.value != "") {
      paramString = `&status_id=${referralStatus.value}`;
    }
    if (nameString.value != "") {
      paramString += `&name=${nameString.value}`;
    }
    const referralsList: any = await useAsyncData(
      "referrals",
      () =>
        $larafetch(
          `/referral/?page=${currentPage.value}&keyword=${
            keywordString.value
          }${paramString}&order_by=${
            orderBy.value
          }&order_type=${
            orderType.value
          }&per_page=${useRuntimeConfig().public.perPage}`
        ),
      { watch: [currentPage] }
    );

    const referrals = computed(() => referralsList.data.value.data);
    const lastPage = computed(() => referralsList.data.value.last_page);

    return {
      referrals,
      lastPage,
      currentPage,
      keywordString,
      referralStatus,
      nameString,
      orderBy,
      orderType
    };
  }
  async function updateReferral(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/referral/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Referral Status Updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          let erroString = "";
          for (const [_, value] of Object.entries(errors)) {
            erroString = "<span class='text-red-600'>" + value + "</span>";
            break;
          }
          swalTopEnd("", erroString, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }
  async function statusList() {
    const list: any = await useAsyncData("status", () =>
      $larafetch(`/referrals-statuses`)
    );
    return list.data;
  }
  return {
    list,
    statusList,
    updateReferral,
    errors,
  };
};
