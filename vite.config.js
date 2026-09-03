import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
    theme: {
      extend: {
        colors: { paper: '#F1EDE4', ink: '#161412', accent: '#FF4A00' },
        fontFamily: {
          display: ['Fraunces', 'Georgia', 'serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        },
      },
    }
})
