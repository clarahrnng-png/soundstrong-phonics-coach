import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // Merge with process.env to ensure system environment variables (like those in Vercel) are included
    const processEnv = { ...process.env, ...env };
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(processEnv.GEMINI_API_KEY || processEnv.VITE_GEMINI_API_KEY || processEnv.API_KEY || processEnv.VITE_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(processEnv.GEMINI_API_KEY || processEnv.VITE_GEMINI_API_KEY || processEnv.API_KEY || processEnv.VITE_API_KEY || "")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
