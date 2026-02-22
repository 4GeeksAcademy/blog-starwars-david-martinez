import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // Esta línea le dice a Vite que trate los archivos .mov como recursos y no como código
    assetsInclude: ['**/*.mov'], 
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist'
    }
})