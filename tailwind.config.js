/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '350px',  // Custom small screen size
        'sm': '640px',  // Small screen (default)
        'md': '768px',  // Medium screen
        'lg': '1024px', // Large screen
        '2lg': '1100px', // Large screen
        'xl': '1280px', // Extra-large screen
        '2xl': '1536px', // Double extra-large screen
        '3xl': '1800px', // Your custom large breakpoint
        '4xl': '2000px', // Another custom breakpoint
      },
    },
  },
  plugins: [],
}
