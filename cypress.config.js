import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Порт Vite можна змінити: npx cypress run --config baseUrl=http://localhost:5174
    baseUrl: 'http://localhost:5173',
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
