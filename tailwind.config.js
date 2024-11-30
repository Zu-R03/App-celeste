/** @type {import('tailwindcss').Config} */ 
module.exports = { 
  content: [ 
    "./src/**/*.{js,jsx,ts,tsx}" 
  ], 
  theme: {  
    extend: { 
      colors:{ 
        primary: "#fff0f8", 
        secondary: "#EF2A8B", 
        complementary: "#DA2C9F",  
        dark_complementary: "#7c0353", 
      } 
    }, 
  },   
  plugins: [], 
} 
 
 