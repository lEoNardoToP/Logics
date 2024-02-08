import { defineConfig } from 'vite'
import usePHP from 'vite-plugin-php';
export default defineConfig({
  plugins: [usePHP()],
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
usePHP({
	binary: '/opt/lampp/bin/php-8.1.10',
});