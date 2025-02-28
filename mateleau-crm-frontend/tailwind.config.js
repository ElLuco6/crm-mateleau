/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'blue-light': '#A7D7F9',
        'blue-marine': '#004E89',
        'green-aquatic': '#3BB273',
        'white-soft': '#F5F5F5',
        'gray-dark': '#2D2D2D',
      },
      fontFamily: {
        title: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
