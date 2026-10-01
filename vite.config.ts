import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({plugins:[vue()],base:'./',worker:{format:'iife'},build:{outDir:'dist',rollupOptions:{input:'app.html'}}});
