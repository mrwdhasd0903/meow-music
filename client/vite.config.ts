const { resolve } = require('path')
import { defineConfig } from 'vite'
import { createSvg } from './src/svg/index'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), createSvg('./src/svg/')],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/style/global.scss";`
      }
    }
  },
  server:{
    proxy:{
       '/api': {
        target: 'http://localhost:7777/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
