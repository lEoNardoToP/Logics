import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: '/HomePage.html',
      },
    },
  },
  server: {
    open: '/HomePage.html',
  },
})