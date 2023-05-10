import { defineConfig } from 'vite'
import logseqDevPlugin from 'vite-plugin-logseq'

export default defineConfig({
  plugins: [
    // Makes HMR available for development
    logseqDevPlugin()
  ],
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
  },
})