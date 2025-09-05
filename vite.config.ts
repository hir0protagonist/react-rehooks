import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [react(), dts()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 're-hooks',
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
});
