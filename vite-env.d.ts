/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
  // Define other environment variables here
}

interface ImportMeta {
  env: ImportMetaEnv;
}
