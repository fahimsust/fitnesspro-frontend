type User = {
  data: any;
  name: string;
  email?: string;
};

// Value is initialized in: ~/plugins/auth.ts
export const useUser = (): any => {
  return useState<User>("user", (): any => undefined);
};

export const useAuth = () => {
  const router = useRouter();

  const user = useUser();
  const isLoggedIn = computed(() => !!user.value);
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  async function refresh() {
    try {
      user.value = await fetchCurrentUser();
    } catch {
      user.value = null;
    }
  }

  async function login(credentials: object) {
    if (isLoggedIn.value) return;
    try {
      await $larafetch(`/login`, { method: "post", body: credentials });
      await refresh();
    } catch (error: any) {
      swalTopEnd("Login Error", `Failed to login: Invalid login details`, "error");
    }
  }

  async function logout() {
    if (!isLoggedIn.value) return;

    await $larafetch("/logout", { method: "post" });
    user.value = null;

    await router.push("/");
  }

  async function forgotPassword(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetch("/forgot-password", {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Email Sent",
          `forgot password link sent to your email`,
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
  async function resetPassword(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetch("/reset-password", {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Password Reset",
          `Password successfully reset`,
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

  return {
    user,
    isLoggedIn,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refresh,
    errors,
    loading
  };
};

export const fetchCurrentUser = async () => {
  try {
    return await $larafetch<User>("/user", {
      redirectIfNotAuthenticated: false,
    });
  } catch (error: any) {
    if ([401, 419].includes(error?.response?.status)) return null;

    throw error;
  }
};
