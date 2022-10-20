import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/**
 * @param newFilename {string}
 * @returns {import('vite').Plugin}
 */
const renameIndexPlugin = newFilename => {
  if (!newFilename) return

  return {
    name: 'renameIndex',
    enforce: 'post',
    generateBundle(options, bundle) {
      const indexHtml = bundle['index.html']
      indexHtml.fileName = newFilename
      console.log('renaming index.html to', indexHtml.fileName)
    },
  }
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    renameIndexPlugin('widget.html'),
  ],
  base: '/app/',
  publicPath: '',
  build: {
    outDir: "app",
  },
  rollupOutputOptions: {
    output: {
      entryFileNames: `assets/[name].js`,
      chunkFileNames: `assets/[name].js`,
      assetFileNames: `assets/[name].[ext]`
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
