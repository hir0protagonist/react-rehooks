import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'react-rehooks',
            fileName: 'index',
        },
        sourcemap: true,
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    plugins: [
        react(),
        dts({
            exclude: ['**/__tests__/**'],
        }),
    ],
});
