// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      company: "Fitness Pro Travel",
      backendUrl: process.env.BACKEND_URL,
      backendBaseUrl: process.env.BACKEND_BASE_URL,
      frontendUrl: process.env.FRONTEND_URL,
      perPage: process.env.PER_PAGE,
      s3ImageUrl: process.env.S3IMAGEURL,
      playwrightTime: process.env.PLAYWRIGHT_WAITING_TIME ? Number(process.env.PLAYWRIGHT_WAITING_TIME) : 0,
    },
  },
  app: {
    head: {
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      //   script: [
      //     // <script src="https://myawesome-lib.js"></script>
      //     { src: 'https://awesome-lib.js' }
      //   ],
      //   link: [
      //     // <link rel="stylesheet" href="https://myawesome-lib.css">
      //     { rel: 'stylesheet', href: 'https://awesome-lib.css' }
      //   ],
      //   // please note that this is an area that is likely to change
      //   style: [
      //     // <style type="text/css">:root { color: red }</style>
      //     { children: ':root { color: red }', type: 'text/css' }
      //   ],
      noscript: [
        // <noscript>Javascript is required</noscript>
        { children: "Javascript is required" },
      ],
    },

    // pageTransition: { name: 'page', mode: 'out-in' }
  },

  //ignore ts files in components
  components: {
    dirs: [
      {
        path: "~/components",
        ignore: ["**/*.ts"],
      },
    ],
  },

  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-security",
    '@nuxt/test-utils/module',
    "@nuxt/image",
    "@vite-pwa/nuxt"
  ],
  pwa: {
    manifest: {
      name: 'Fitness Pro Travel App',
      lang: 'en',
      "icons": [
        {
          "src": "assets/images/logo-pwa.png",
          "type": "image/png",
          "sizes": "144x144"
        },
        {
          "src": "assets/images/logo-pwa.png",
          "type": "image/png",
          "sizes": "any",
          "purpose": "any"
        },
        {
          "src": "assets/images/logo-pwa.png",
          "type": "image/png",
          "sizes": "any",
          "purpose": "maskable"
        }
      ],
      theme_color:"#128a00",
      description:"Fitness Pro Travel, Teaching vacations via Fit Bodies",
      screenshots: [{ src: "assets/images/narrow.png", form_factor: "narrow", sizes: "1052x1272", "type": "image/png"},{ src: "assets/images/screenshot.png", form_factor: "wide", sizes: "2680x1190", "type": "image/png" }],
    }
  },
  nitro: {
    compressPublicAssets: true,
  },
  security: {
    rateLimiter: {
      tokensPerInterval:1000,
      interval: 300000,
      headers: false,
      throwError: true,
      driver: {
        name: 'lruCache',
        options: {}
      }
    },
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "ik.imagekit.io", "data:","blob:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "upgrade-insecure-requests": true,
      },
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      "postcss-import": {},
      "postcss-advanced-variables": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  imports: {
    dirs: ["~/utils",'composables/*',],
  },
  // Vite configuration
  vite: {
    build: {
      // Increase the chunk size warning limit
      chunkSizeWarningLimit: 2000, // The limit in KB
    },

    // Other Vite-specific configurations...
  },
});