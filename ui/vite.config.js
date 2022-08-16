import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        }
    },
    base: '/ui/',
    server: {
        port: 3001
    },
    preview: {
        port: 3001
    }
});
