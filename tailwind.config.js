/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // ya lo tienes bien
    "./node_modules/flowbite/**/*.js" // agrega esta línea para que Tailwind procese los componentes de Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Agrega Flowbite como plugin
  ],
}
