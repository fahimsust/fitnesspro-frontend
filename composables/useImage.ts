export const useImages = () => {
  const route = useRoute();
  let loading = ref(false)
  const page = route.query.page;
  const errors: { [key: string]: any; } = reactive({})
  const currentPage = ref(1);
  const order_by = route.query.order_by;
  const order_type = route.query.order_type;
  const orderBy = ref(typeof order_by == "string" ? order_by : "");
  const orderType = ref(typeof order_type == "string" ? order_type : "");

  async function list(keword: string = "", product_id: number = 0) {
    let paramString = `page=${currentPage.value}&order_by=${
      orderBy.value
    }&order_type=${
      orderType.value
    }&keyword=${keword}&per_page=${useRuntimeConfig().public.perPage
      }`;
    if (product_id > 0) {
      paramString = paramString + `&product_id=${product_id}`
    }
    const imageList: any = await useAsyncData("customForms", () =>
      $larafetchfront(`/image?${paramString}`)
    );

    const images = computed(() => imageList.data.value.data);
    const lastPage = computed(() => imageList.data.value.last_page);

    return {
      images,
      lastPage,
      currentPage,
      orderBy,
      orderType
    };
  }
  async function saveImage(formData: object) {
    loading.value = true
    let image_id = 0
    await submitRequest(
      $larafetchfront("/image", { method: "post", body: formData }),
      (result: any) => {
        clearValidationErrors(errors)
        swalTopEnd("Created Successfully", `Image created successfully`, 'success')
        image_id = result.id
      },
      (validationErrors) => {

        if (validationErrors) {
          clearValidationErrors(errors)
          addValidationErrors(errors, validationErrors)
          swalTopEnd("Create failed", `Please solve the errors`, 'error')
        }

      },
      () => loading.value = false
    )
    return image_id

  }
  return {
    saveImage,
    errors,
    list,
    loading
  }

}