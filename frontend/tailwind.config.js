/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ligne indispensable pour activer le mode sombre via une classe CSS
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}