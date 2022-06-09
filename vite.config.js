import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath, URL } from 'url'

import { getGitInfo } from './build/gitinfo'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {return{
  define: {
    // 参见 getGitInfo()，注入提交(commit)信息
    __BUILD_INFO__: JSON.stringify(mode === 'production' ? getGitInfo() : "development build")
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}})
