type Account = {
  data: any;
  name: string;
  email?: string;
};

// Value is initialized in: ~/plugins/auth.ts
export const useAccountState = (): any => {
  return useState<Account>("account", (): any => undefined);
};

export const useAccountAuth = () => {
  const router = useRouter();
  let loading = ref(false);
  const errors: { [key: string]: any } = reactive({});

  const account = useAccountState();
  const isMemberLoggedIn = computed(() => !!account.value);

  async function refresh() {
    try {
      account.value = await fetchCurrentAccount();
    } catch {
      account.value = null;
    }
  }

  async function login(credentials: object) {
    if (isMemberLoggedIn.value) return;
    try {
      await $larafetchfront(`/login`, { method: "post", body: credentials });
      await refresh();
      window.location.reload();
    } catch (error: any) {
      swalTopEnd("Login Error", `Failed to login: Invalid login details`, "error");
    }
  }

  async function logout() {
    if (!isMemberLoggedIn.value) return;

    await $larafetchfront("/logout", { method: "post" });
    account.value = null;
  }
  async function forgotUsername(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/forgot-username", {
        method: "post",
        body: formData,
      }),
      (result: any) => {
        clearValidationErrors(errors);
        swalTopEnd(
          "Email Sent",
          `Username sent to your email`,
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
  async function forgotPassword(formData: object) {
    loading.value = true;
    let result: any = {}
    result = await submitRequest(
      $larafetchfront("/forgot-password", {
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
      $larafetchfront("/reset-password", {
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
    account,
    isMemberLoggedIn,
    login,
    logout,
    forgotPassword,
    resetPassword,
    forgotUsername,
    refresh,
    errors,
    loading
  };
};

export const fetchCurrentAccount = async () => {
  try {
    return await $larafetchfront<Account>("/user", {
      redirectIfNotAuthenticated: false,
    });
  } catch (error: any) {
    if ([401, 419].includes(error?.response?.status)) return null;

    throw error;
  }
};
