import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      // 导入scss预编译程序
      scss: {
        additionalData: `@use "@/style/mixins.scss" as *;`,
      },
    },
  },
},


)


