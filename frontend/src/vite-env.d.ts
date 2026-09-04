/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOKEY_API_URL?: string;
  readonly VITE_TOKEY_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
