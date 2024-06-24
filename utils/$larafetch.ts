//https://github.com/amrnn90/breeze-nuxt/tree/master/utils

import { $fetch, type FetchOptions, FetchError } from "ofetch";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

// Unfortunately could not import these types from ofetch, so copied them here
interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
}
type ResponseType = keyof ResponseMap | "json" | "blob";
// end of copied types

type LarafetchOptions<R extends ResponseType> = FetchOptions<R> & {
  redirectIfNotAuthenticated?: boolean;
  redirectIfNotVerified?: boolean;
};
export async function $larafetchfront<T, R extends ResponseType = "json">(
  path: RequestInfo,
  {
    redirectIfNotAuthenticated = true,
    redirectIfNotVerified = true,
    ...options
  }: LarafetchOptions<R> = {}
) {
  const { backendBaseUrl, frontendUrl } = useRuntimeConfig().public;
  const router = useRouter()

  let token = useCookie(CSRF_COOKIE).value;

  // on client initiate a csrf request and get it from the cookie set by laravel
  if (
    process.client &&
    ["post", "delete", "put", "patch"].includes(options?.method?.toLowerCase() ?? '')
  ) {
    await initCsrf();
    // cannot use nuxt composables such as useCookie after an async operation: https://github.com/nuxt/framework/issues/5238
    token = getCookie(CSRF_COOKIE);
  }

  let headers: any = {
    ...options?.headers,
    ...(token && { [CSRF_HEADER]: token }),
    accept: "application/json",
    "content-type": "application/json",
  };

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"]),
      referer: frontendUrl,
    };
  }

  try {
    return await $fetch<T, R>(path, {
      baseURL: backendBaseUrl + '/api',
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (!(error instanceof FetchError)) throw error;

    // when any of the following redirects occur and the final throw is not caught then nuxt SSR will log the following error:
    // [unhandledRejection] Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

    const status = error.response?.status ?? -1;
    const currentRoute = router.currentRoute.value.path

    if (
      redirectIfNotAuthenticated &&
      [401, 419].includes(status) &&
      currentRoute !== '/login'
    ) {
      await router.push('/')
    }

    if (redirectIfNotVerified && [409].includes(status)) {
      await router.push('/verify-email')
    }

    if ([500].includes(status)) {
      console.error("[Laravel Error]", error.data?.message, error.data);
    }

    throw error;
  }
}
type BlobFetchOptions = {
  redirectIfNotAuthenticated?: boolean;
  redirectIfNotVerified?: boolean;
  [key: string]: any; // Other potential properties
};

export async function $larafetchBlob<T>(
  path: RequestInfo,
  {
    redirectIfNotAuthenticated = true,
    redirectIfNotVerified = true,
    ...options
  }: BlobFetchOptions = {}
) {
  const { backendUrl, frontendUrl } = useRuntimeConfig().public;
  const router = useRouter()

  let token = useCookie(CSRF_COOKIE).value;

  if (
    process.client &&
    ["post", "delete", "put", "patch"].includes(options?.method?.toLowerCase() ?? '')
  ) {
    await initCsrf();
    token = getCookie(CSRF_COOKIE);
  }
  
  let headers: any = {
    ...options?.headers,
    accept: "application/json",
  };

  if (token) {
    headers[CSRF_HEADER] = token;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"]),
      referer: frontendUrl,
    };
  }

  try {
    return await $fetch<T, "blob">(path, {
      baseURL: backendUrl,
      ...options,
      responseType: "blob", // Specify responseType as "blob"
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (!(error instanceof FetchError)) throw error;

    const status = error.response?.status ?? -1;

    if (
      redirectIfNotAuthenticated &&
      [401, 419].includes(status)
    ) {
      const user = useUser()
      if (user.value !== undefined)
        user.value = null
      await router.push('/')
    }

    if (redirectIfNotVerified && [409].includes(status)) {
      await router.push('/verify-email')
    }

    if ([500].includes(status)) {
      console.error("[Laravel Error]", error.data?.message, error.data);
    }

    throw error;
  }
}




export async function $larafetch<T, R extends ResponseType = "json">(
  path: RequestInfo,
  {
    redirectIfNotAuthenticated = true,
    redirectIfNotVerified = true,
    ...options
  }: LarafetchOptions<R> = {}, multiPart: boolean = false
) {
  const { backendUrl, frontendUrl } = useRuntimeConfig().public;
  const router = useRouter()

  let token = useCookie(CSRF_COOKIE).value;

  // on client initiate a csrf request and get it from the cookie set by laravel
  if (
    process.client &&
    ["post", "delete", "put", "patch"].includes(options?.method?.toLowerCase() ?? '')
  ) {
    await initCsrf();
    // cannot use nuxt composables such as useCookie after an async operation: https://github.com/nuxt/framework/issues/5238
    token = getCookie(CSRF_COOKIE);
  }
  let headers: any = {
    ...options?.headers,
    accept: "application/json",
  };

  if (token) {
    headers[CSRF_HEADER] = token;
  }

  // When sending FormData, don't set the 'content-type'
  if (!multiPart) {
    headers['content-type'] = 'application/json';
  }


  // let headers: any = {
  //   ...options?.headers,
  //   ...(token && { [CSRF_HEADER]: token }),
  //   accept: "application/json",
  //   "content-type": "application/json",
  // };

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"]),
      referer: frontendUrl,
    };
  }

  try {
    return await $fetch<T, R>(path, {
      baseURL: backendUrl,
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (!(error instanceof FetchError)) throw error;

    // when any of the following redirects occur and the final throw is not caught then nuxt SSR will log the following error:
    // [unhandledRejection] Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

    const status = error.response?.status ?? -1;

    if (
      redirectIfNotAuthenticated &&
      [401, 419].includes(status)
    ) {
      const user = useUser()
      if (user.value !== undefined)
        user.value = null
      await router.push('/')
    }

    if (redirectIfNotVerified && [409].includes(status)) {
      await router.push('/verify-email')
    }

    if ([500].includes(status)) {
      console.error("[Laravel Error]", error.data?.message, error.data);
    }

    throw error;
  }
}

async function initCsrf() {
  const { backendBaseUrl } = useRuntimeConfig().public;

  await $fetch("/sanctum/csrf-cookie", {
    baseURL: backendBaseUrl,
    credentials: "include",
  });
}

// https://github.com/axios/axios/blob/bdf493cf8b84eb3e3440e72d5725ba0f138e0451/lib/helpers/cookies.js
function getCookie(name: string) {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
  );
  return match ? decodeURIComponent(match[3]) : null;
}