export const useReviews = () => {
  const route = useRoute();
  const page = route.query.page;
  const deleteConfirmationModal = ref(false);
  const keyword = route.query.keyword;
  const itemIdRoute = route.query.item_id;
  const keywordString = ref(typeof keyword == "string" ? keyword : "");
  const itemIdString = ref(typeof itemIdRoute == "string" ? itemIdRoute : "");
  const currentPage = ref(typeof page == "string" ? parseInt(page) : 1);
  let reviewId = 0;
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list() {
    let paramString = `page=${currentPage.value}&keyword=${
      keywordString.value
    }&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&per_page=${useRuntimeConfig().public.perPage}`;
    if (parseInt(itemIdString.value) > 0) {
      paramString = paramString + `&item_id=${itemIdString.value}`;
    }
    const reviewList: any = await useAsyncData("reviews", () =>
      $larafetch(`/product-review?${paramString}`)
    );

    const reviews = computed(() => reviewList.data.value.data);
    const lastPage = computed(() => reviewList.data.value.last_page);

    return {
      reviews,
      lastPage,
      currentPage,
      keywordString,
      itemIdString,
      orderBy,
      orderType
    };
  }
  async function deleteReview() {
    try {
      await $larafetch(`/product-review/${reviewId}`, { method: "delete" });
      swalTopEnd(
        "Deleted Successfully",
        `Review successfully deleted`,
        "success"
      );
      const { reviews } = await list();
      if (reviews.value.length == 0) {
        if (currentPage.value > 1) {
          createNewPathAndPush(
            "page",
            (currentPage.value - 1).toString(),
            true
          );
          currentPage.value = currentPage.value - 1;
          await list();
        }
      }
    } catch (error: any) {
      swalTopEnd("", error.data?.message, "error", 10000);
    }
    deleteConfirmationModal.value = false;
  }
  async function updateReview(formData: object, id: number) {
    loading.value = true;
    const result: any = await submitRequest(
      $larafetch(`/product-review/${id}`, {
        method: "put",
        body: formData,
      }),
      (_: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Updated Successfully",
          `Review Updated successfully`,
          "success"
        );
      },
      (validationErrors) => {
        if (validationErrors) {
          clearValidationErrors(errors);
          addValidationErrors(errors, validationErrors);
          swalTopEnd("Update failed", `Please solve the errors`, "error");
        }
      },
      () => (loading.value = false)
    );
    return result.data;
  }

  async function getReview(id: number) {
    const result: any = await useAsyncData("review", () =>
      $larafetch(`/product-review/${id}`)
    );
    return result.data;
  }

  async function statusChange(value:boolean, id: number) {
    const formData = {'approved':value}
    await useAsyncData("reviewStatusChange", () =>
      $larafetch(`/product-review/${id}/status`, {
        method: "post",
        body: formData,
      })
    );
    if(value == true)
    {
      swalTopEnd("Review Approved", `Review Approved Successfully`, "success");
    }
    else
    {
      swalTopEnd("Review Unapproved", `Review Unapproved Successfully`, "success");
    }
    
    await list();
  }
  function setDeleteId(id: number) {
    reviewId = id;
  }

  return {
    reviewId,
    list,
    getReview,
    updateReview,
    deleteReview,
    statusChange,
    setDeleteId,
    errors,
    loading,
    deleteConfirmationModal,
  };
};
