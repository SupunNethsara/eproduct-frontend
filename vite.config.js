import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './', // production relative paths
    server: {
        proxy: {
            // Development-only proxy for API requests
            '/register': 'https://eproducttest.netlify.app',
            '/login': 'https://eproducttest.netlify.app',
            // add other API endpoints as needed
        }
    }
})
