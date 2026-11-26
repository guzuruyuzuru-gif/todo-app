import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/todo-app/',

  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        todo: resolve(import.meta.dirname, 'todo.html'),
      },
    },
  },
});
