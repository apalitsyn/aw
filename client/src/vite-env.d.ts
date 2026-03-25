/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_DADATA_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
