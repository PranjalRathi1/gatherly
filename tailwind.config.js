/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode manually if needed, but we will force it
    theme: {
        extend: {
            colors: {
                // Custom colors extracted from your screenshots
                dark: {
                    bg: '#0F1115',      // Main background
                    card: '#181B21',    // Card/Element background
                    nav: '#1A1D21',     // Bottom nav bar
                    input: '#2A2D35',   // Search inputs
                },
                brand: {
                    blue: '#2F80ED',    // The primary blue button color
                    green: '#27AE60',   // WhatsApp/Success green
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}