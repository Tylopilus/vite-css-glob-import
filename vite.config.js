import Inspect from 'vite-plugin-inspect';
import vitePluginCssGlobImport from './index.js';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [Inspect(), vitePluginCssGlobImport()],
});
