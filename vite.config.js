import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
  define: {
    "__DEV__":  (mode === "development").toString(),
  },
  plugins: [vue()],
  ssr: {
    noExternal: ['@apollo/client', '@vue/apollo-composable'],
  },
  resolve: {
    alias: {
      'src': path.resolve('./src')
    }
  }
}));
