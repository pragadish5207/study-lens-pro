import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // This makes sure users always get your newest updates automatically!
      manifest: {
        name: 'Study-Lens Pro',
        short_name: 'Study-Lens',
        description: 'Your Hybrid AI Study Companion',
        theme_color: '#B026FF', // Your glowing purple accent color
        background_color: '#0B0B0F', // Your sleek dark mode background
        display: 'standalone', // This hides the browser URL bar so it looks like a real native app!
        icons: [
          {
            // We are using a temporary online icon for now so it works instantly
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})